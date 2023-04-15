export const api_base = `${process.env.API_ENDPOINT}:${process.env.API_PORT}`;
export const user_endpoint = api_base+'/api/users';
export const room_endpoint = api_base+'/api/rooms';
export const message_endpoint = api_base+'/api/messages';
export const register_endpoint = api_base+'/api/auth/register';
export const login_endpoint = api_base+'/api/auth/login';
export const logout_endpoint = api_base+'/api/auth/logout';
export const search_endpoint = api_base+'/api/search';
export const emergency_endpoint = api_base + '/api/emergencywords';
export const profile_endpoint = api_base + '/api/profiles';