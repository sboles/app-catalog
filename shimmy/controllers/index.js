exports.proxy = function (req, res) {
  res.render('index', {
    title: 'shimmy'
  });
};
