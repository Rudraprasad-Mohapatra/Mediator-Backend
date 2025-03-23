router.get("/conversations", auth, getConversations);
router.get("/:id/messages", auth, getMessages);
router.post("/:id/messages", auth, sendMessage);
router.put("/messages/:id/read", auth, markAsRead);
