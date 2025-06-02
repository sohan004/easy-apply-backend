const getFileFullUrl = async (req, name) => {
    const host =  req?.get("host");
    const protocol =  req?.protocol;
    return `${protocol}://${host}/api/v1/media/${name}`;
}

module.exports = getFileFullUrl;