import AuthController from '../../src/auth/auth.controller';
import MessageController from '../../src/message/message.controller';
import { ApiException, ErrorMessage } from '../../src/responses/api.exception';
import { User } from '../../src/user/user.entity';
import ESNDataSource from '../../src/utils/datasource';

const messageController = new MessageController();
const authController = new AuthController();

beforeEach(async () => {
    await ESNDataSource.initialize();
});

afterEach(async () => {
    await ESNDataSource.destroy();
});

describe('postMessage', () => {
    it('Should successfully send the message', async () => {
        const authUserInput = {
            username: 'hakan',
            password: '12345',
        };
        await authController.registerUser(authUserInput);
        const userRepository = ESNDataSource.getRepository(User);
        const user =
        (await userRepository.findOneBy({
            username: authUserInput.username,
        })) || new User();

        const postMessageInput = {
            userId: user.id,
            content: 'hello',
            roomId: 'public',
        };
        
        expect(await messageController.postMessage(postMessageInput)).not.toBeNull();

    });

    it('Should not send messages if input is invalid', async () => {
        const authUserInput = {
            username: 'hakan',
            password: '12345',
        };
        const userRepository = ESNDataSource.getRepository(User);
        const user =
        (await userRepository.findOneBy({
            username: authUserInput.username,
        })) || new User();

        // Case user id is invalid
        await authController.registerUser(authUserInput);

        const invalidUserIdMessageInput = {
            userId: 'invalid id',
            content: 'hello',
            roomId: 'public',
        };
        
        try {
            await messageController.postMessage(invalidUserIdMessageInput);
          } catch (error) {
            expect((<ApiException>error).error_message).toBe(
              ErrorMessage.WRONGUSERNAME
            );
          }

        // Case message is empty
        const emptyMessageInput = {
            userId: user.id,
            content: '',
            roomId: 'public',
        };
        
        try {
            await messageController.postMessage(emptyMessageInput);
          } catch (error) {
            expect((<ApiException>error).error_message).toBe(
              ErrorMessage.EMPTYMESSAGE
            );
          }

         // Case room is not valid
         const invalidRoomMessageInput = {
             userId: user.id,
             content: 'hello',
             roomId: 'invalid room',
         };
         
         try {
             await messageController.postMessage(invalidRoomMessageInput);
           } catch (error) {
             expect((<ApiException>error).error_message).toBe(
               ErrorMessage.ROOMIDNOTFOUND
             );
           }
    });
});