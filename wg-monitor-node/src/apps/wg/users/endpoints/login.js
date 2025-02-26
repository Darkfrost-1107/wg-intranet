const {router} = app.CreateApp();

router.get('/', (req, res) => {
  if (!req.session.user) {
    req.session.user = {
      authenticated: false,
    };
  }

  const { authenticated } = req.session.user;
  res.json({ ...req.session.user,
    detail: authenticated ? 'Authenticated' : 'NotAuthenticated',
  });
});

router.post('/', [auth.basicAuth], async (req, res) => {
  
  const {authenticated} = req.session.user;
  
  res.json({ ...req.session.user,
    detail: authenticated ? 'Authenticated' : 'Wrong-Credentials',
  });
});

module.exports = router;