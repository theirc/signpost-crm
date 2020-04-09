exports.noResponse = async (req, res, next) => {
    console.log("CHECKING NO RESPONSE")
    res.status(200).send("OK");
};

