router.get("/cases", auth, mediatorAuth, getCases);
router.post("/cases/:id/accept", auth, mediatorAuth, acceptCase);
router.put("/cases/:id/status", auth, mediatorAuth, updateCaseStatus);
router.get("/analytics", auth, mediatorAuth, getAnalytics);
