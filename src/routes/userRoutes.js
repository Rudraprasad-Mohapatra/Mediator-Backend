router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.get("/matches", auth, getMatches);
router.post("/preferences", auth, updatePreferences);
