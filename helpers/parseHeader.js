exports.getBearerToken = (headers) => {
    const auth = headers.authorization?.toString();
    return auth.split('Bearer ')[1];
}