export const formatResponse = (data: any, message = 'Success') => ({
  success: true,
  message,
  data,
});
