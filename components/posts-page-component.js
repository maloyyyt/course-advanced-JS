import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import {
  posts,
  goToPage,
  user,
  refreshPostsList,
} from "../index.js";
import { dislikePost, likePost } from "../api.js";
import { escapeHtml, formatTimeAgo } from "../helpers.js";

function getLikeImageSrc(isLiked) {
  return isLiked
    ? "./assets/images/like-active.svg"
    : "./assets/images/like-not-active.svg";
}

function renderPostHTML(post) {
  const likesCount = post.likes ? post.likes.length : 0;
  const isLiked = Boolean(post.isLiked);

  return `
    <li class="post">
      <div class="post-header" data-user-id="${post.user.id}">
        <img src="${post.user.imageUrl}" class="post-header__user-image" alt="Аватар ${escapeHtml(post.user.name)}">
        <p class="post-header__user-name">${escapeHtml(post.user.name)}</p>
      </div>
      <div class="post-image-container">
        <img class="post-image" src="${post.imageUrl}" alt="Фото поста">
      </div>
      <div class="post-likes">
        <button data-post-id="${post.id}" data-is-liked="${isLiked}" class="like-button">
          <img src="${getLikeImageSrc(isLiked)}" alt="Лайк">
        </button>
        <p class="post-likes-text">
          Нравится: <strong class="post-likes-count">${likesCount}</strong>
        </p>
      </div>
      <p class="post-text">
        <span class="user-name">${escapeHtml(post.user.name)}</span>
        ${escapeHtml(post.description)}
      </p>
      <p class="post-date">
        ${formatTimeAgo(post.createdAt)}
      </p>
    </li>
  `;
}

export function renderPostsPageComponent({ appEl, showUserHeader = false }) {
  const userHeaderHTML =
    showUserHeader && posts.length > 0
      ? `
        <div class="posts-user-header" data-user-id="${posts[0].user.id}">
          <img
            src="${posts[0].user.imageUrl}"
            class="posts-user-header__user-image"
            alt="Аватар ${escapeHtml(posts[0].user.name)}"
          >
          <p class="posts-user-header__user-name">${escapeHtml(posts[0].user.name)}</p>
        </div>
      `
      : "";

  const postsHTML =
    posts.length > 0
      ? posts.map((post) => renderPostHTML(post)).join("")
      : `<p class="post-text">Постов пока нет</p>`;

  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      ${userHeaderHTML}
      <ul class="posts">
        ${postsHTML}
      </ul>
    </div>
  `;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (const userEl of document.querySelectorAll(".post-header, .posts-user-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  for (const likeButton of document.querySelectorAll(".like-button")) {
    likeButton.addEventListener("click", () => {
      if (!user) {
        return;
      }

      const postId = likeButton.dataset.postId;
      const isLiked = likeButton.dataset.isLiked === "true";
      const token = `Bearer ${user.token}`;
      const request = isLiked
        ? dislikePost({ token, postId })
        : likePost({ token, postId });

      request
        .then(() => refreshPostsList())
        .catch((error) => {
          console.error(error);
        });
    });
  }
}
