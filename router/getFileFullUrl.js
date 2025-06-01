const getFileFullUrl = async (req, name) => {
    const host = await req.get("host");
    const protocol = await req.protocol;
    return `${protocol}://${host}/api/v1/media/${name}`;
}

module.exports = getFileFullUrl;