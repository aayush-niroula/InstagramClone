import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';
import { addCommment, addNewPost, bookmarkPost, deletePost, dislikePost, getAllComments, getAllPost, getUserpost, likePost } from '../controllers/post.controller.js';

const router= express.Router();

router.route("/addpost").post(isAuthenticated,upload.single('image'),addNewPost)
router.route("/all").get(isAuthenticated,getAllPost)
router.route("/userpost/all").get(isAuthenticated,getUserpost)
router.route("/:id/like").get(isAuthenticated,likePost)
router.route("/:id/dislike").get(isAuthenticated,dislikePost)
router.route("/:id/comment").post(isAuthenticated,addCommment)
router.route("/:id/comment/all").post(isAuthenticated,getAllComments)
router.route("/delete/:id").delete(isAuthenticated,deletePost)
router.route("/:id/bookmark").get(isAuthenticated,bookmarkPost)

export default router;
