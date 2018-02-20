module.exports = function (app) {

    //Call and Responce Basic
    app.get("/say/:message", function (req, res) {
        var msg = req.params["message"];
        console.log(msg);
        res.send({ message: msg });
    });
};