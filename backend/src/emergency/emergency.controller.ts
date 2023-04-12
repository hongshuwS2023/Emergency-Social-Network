import {Body, Delete, Get, Post, Put, Query, Route} from 'tsoa';
import {LessThan, MoreThan, Repository} from 'typeorm';
import {
  EmergencyWordsTransit,
  PostEmergencyWordsInput,
  UpdateEmergencyWordsInput,
} from '../requests/emergencywords.input';
import {
  BadRequestException,
  ErrorMessage,
  NotFoundException,
} from '../responses/api.exception';
import {User} from '../user/user.entity';
import ESNDataSource from '../utils/datasource';
import {EmergencyWords} from './emergency.entity';
import {v4 as uuid} from 'uuid';
import {RedisServer} from '../utils/redisServer';
import {SocketServer} from '../utils/socketServer';
import {GetEmergencyWordsResponse} from '../responses/emergencywords.response';

@Route('/api/emergency')
export default class EmergencyWordsController {
  emergencyRepository: Repository<EmergencyWords>;
  userRepository: Repository<User>;

  constructor() {
    this.emergencyRepository = ESNDataSource.getRepository(EmergencyWords);
    this.userRepository = ESNDataSource.getRepository(User);
  }

  /**
   * Get the unsent emergency message
   * @returns word
   */
  async getUnsentEmergencyWordsByUserId(
    userId: string
  ): Promise<EmergencyWords | null> {
    return await this.emergencyRepository.findOneBy({
      sender: userId,
      time_to_send: MoreThan(Date.now().toString()),
    });
  }

  /**
   * Get all emergency messages
   * @returns words
   */
  @Get('')
  async getEmergencyWords(
    @Query('userid') userid: string,
    @Query('username') username: string
  ): Promise<GetEmergencyWordsResponse> {
    const now = Date.now().toString();
    const availables = await this.emergencyRepository.find({
      where: [
        {contact: 'all', time_to_send: LessThan(now)},
        {contact: username, time_to_send: LessThan(now)},
        {sender: userid, time_to_send: LessThan(now)},
      ],
      order: {
        time_created: 'desc',
        timeout: 'asc',
      },
    });

    const unsent = await this.getUnsentEmergencyWordsByUserId(userid);

    return {availables: availables, unsent: unsent};
  }

  /**
   * Create a new emergency words
   * @param postEmergencyWordsInput
   * @returns words
   */
  @Post()
  async postEmergencyWords(
    @Body() postEmergencyWordsInput: PostEmergencyWordsInput
  ): Promise<EmergencyWords> {
    const user = await this.userRepository.findOneBy({
      id: postEmergencyWordsInput.user_id,
    });

    const contact = await this.userRepository.findOneBy({
      username: postEmergencyWordsInput.contact,
    });

    if (user === null || contact === null) {
      throw new NotFoundException(ErrorMessage.WRONGUSERNAME);
    }

    if (postEmergencyWordsInput.content.trim().length === 0) {
      throw new BadRequestException(ErrorMessage.EMPTYMESSAGE);
    }

    if (await this.getUnsentEmergencyWordsByUserId(user.id)) {
      throw new BadRequestException(ErrorMessage.EXISTINGMESSAGE);
    }

    const words = this.emergencyRepository.create();

    words.id = uuid();
    words.sender = user.id;
    words.time_created = Date.now().toString();
    words.email = postEmergencyWordsInput.email;
    words.contact = postEmergencyWordsInput.contact;
    words.content = postEmergencyWordsInput.content;
    words.timeout = postEmergencyWordsInput.timeout;
    words.time_to_send = String(
      Number(words.time_created) + words.timeout * 1000 * 60 * 60
    );
    await this.emergencyRepository.save(words);

    const transit: EmergencyWordsTransit = {
      user_id: contact.id,
      email: words.email,
      emergency_id: words.id,
      content: words.content,
    };

    await this.setEmergencyWords(postEmergencyWordsInput.timeout, transit);

    return words;
  }

  /**
   * Update an emergency words
   * @param updateEmergencyWordsInput
   * @returns words
   */
  @Put()
  async updateEmergencyWords(
    @Body() updateEmergencyWordsInput: UpdateEmergencyWordsInput
  ): Promise<EmergencyWords> {
    const emergencyWords = await this.emergencyRepository.findOneBy({
      id: updateEmergencyWordsInput.id,
    });

    if (!emergencyWords || emergencyWords.contact === 'all') {
      throw new NotFoundException(ErrorMessage.NOSUCHEMERGENCYMESSAGE);
    }

    if (
      emergencyWords.sender !== updateEmergencyWordsInput.user_id &&
      updateEmergencyWordsInput.contact !== 'all'
    ) {
      throw new BadRequestException(ErrorMessage.FORBIDDENUPDATEUSER);
    }

    if (
      emergencyWords.sender !== updateEmergencyWordsInput.user_id &&
      updateEmergencyWordsInput.contact === 'all'
    ) {
      emergencyWords.contact = 'all';

      const res = await this.emergencyRepository.save(emergencyWords);

      this.broadcastEmergencyWords();

      return res;
    }

    const contact = await this.userRepository.findOneBy({
      username: emergencyWords.contact,
    });

    const transit: EmergencyWordsTransit = {
      user_id: contact!.id,
      email: emergencyWords.email,
      emergency_id: emergencyWords.id,
      content: emergencyWords.content,
    };

    await this.removeEmergencyWords(transit);

    emergencyWords.contact = updateEmergencyWordsInput.contact || emergencyWords.contact;
    emergencyWords.content = updateEmergencyWordsInput.content || emergencyWords.content;
    emergencyWords.email = updateEmergencyWordsInput.email || '';
    emergencyWords.timeout = updateEmergencyWordsInput.timeout! || emergencyWords.timeout;
    emergencyWords.time_created = Date.now().toString();
    emergencyWords.time_to_send = String(
      Number(emergencyWords.time_created) +
        emergencyWords.timeout * 1000 * 60 * 60
    );
    await this.setEmergencyWords(updateEmergencyWordsInput.timeout!, transit);

    return await this.emergencyRepository.save(emergencyWords);
  }

  /**
   * Delete an emergency words
   * @param id
   * @returns null
   */
  @Delete(':id')
  async deleteEmergencyWords(@Query() id: string): Promise<void> {
    const emergencyWords = await this.emergencyRepository.findOneBy({
      id: id,
    });

    if (!emergencyWords) {
      throw new NotFoundException(ErrorMessage.NOSUCHEMERGENCYMESSAGE);
    }

    if (emergencyWords.contact === 'all') {
      await this.emergencyRepository.delete(emergencyWords);
      return;
    }

    const contact = await this.userRepository.findOneBy({
      username: emergencyWords.contact,
    });

    const transit: EmergencyWordsTransit = {
      user_id: contact!.id,
      email: emergencyWords.email,
      emergency_id: emergencyWords.id,
      content: emergencyWords.content,
    };

    await this.removeEmergencyWords(transit);

    await this.emergencyRepository.delete(emergencyWords);

    this.broadcastEmergencyWords();
    return;
  }

  async removeEmergencyWords(transit: EmergencyWordsTransit) {
    await RedisServer.getInstance().removeEmergencyWords(transit);
  }

  async setEmergencyWords(timeout: number, transit: EmergencyWordsTransit) {
    RedisServer.getInstance().setEmergencyWords(timeout, transit);
  }

  broadcastEmergencyWords() {
    SocketServer.getInstance().sendEmergencyWordsChange();
  }
}
