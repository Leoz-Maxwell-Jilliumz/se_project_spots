import "./index.css";
import logo from "../images/Logo.svg";
import avatar from "../images/avatar.jpg";
import pencil from "../images/pencil.svg";
import plus from "../images/plus.svg";
import closeNorm from "../images/close-btn.svg";
import closeWhite from "../images/white-close.svg";
import { setButtonText } from "../utils/helper.js";
import Api from "../utils/Api.js";
import {
  enableValidation,
  resetValidation,
  settings,
} from "../scripts/validation.js";
/*const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Val Thornes",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaraunt terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountian house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
]; */

//icon declaration
const cardTemplate = document.querySelector("#card-template");
const logoImg = document.getElementById("Logo");
logoImg.src = logo;
const avatarImg = document.getElementById("avatar-icon");
avatarImg.src = avatar;
const editImg = document.getElementById("pencil-icon");
editImg.src = pencil;
const plusImg = document.getElementById("plus-icon");
plusImg.src = plus;
const closeEdit = document.getElementById("close-icon");
closeEdit.src = closeNorm;
const closePost = document.getElementById("close-icon-post");
closePost.src = closeNorm;
const closeEditAvatar = document.getElementById("close-icon-avatar");
closeEditAvatar.src = closeNorm;
const closeWhiteEl = document.getElementById("close-white-icon");
closeWhiteEl.src = closeWhite;
const closeDelete = document.getElementById("delete-close-white-icon");
closeDelete.src = closeWhite;

// forms & modal things
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const avatarModalButton = document.querySelector(".profile__avatar-btn");
const avatarForm = editAvatarModal.querySelector(".modal__form");
const avatarCloseButton = editAvatarModal.querySelector(".modal__close-button");
const profileEditBtn = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editFormElement = editProfileModal.querySelector(".modal__form");
const closeProfileModal = editProfileModal.querySelector(
  ".modal__close-button"
);
const profileSubmitButton = editProfileModal.querySelector(
  ".modal__submit-button"
);
const avatarSubmitButton = editAvatarModal.querySelector(
  ".modal__submit-button"
);
const avatarInput = editAvatarModal.querySelector("#avatar-link-input");

const nameInput = editProfileModal.querySelector("#profile-name-input");
const descriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);
const newPostModal = document.querySelector("#new-post-modal");
const newPostBtn = document.querySelector(".profile__add-btn");
const closePostModal = newPostModal.querySelector(".modal__close-button");
const postFormEL = newPostModal.querySelector(".modal__form");
const postLinkInput = newPostModal.querySelector("#post-link-input");
const postCaptionInput = newPostModal.querySelector("#post-caption-input");

const cardsList = document.querySelector(".cards__list");
const previewModal = document.querySelector("#preview-modal");
const closePreviewModal = previewModal.querySelector(".modal__close-button");
const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");
const cardSubmitButton = newPostModal.querySelector(".modal__submit-button");
const modals = document.querySelectorAll(".modal");
// Delete Modal Components
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const confirmDeleteButton = deleteModal.querySelector(".delete__button");
const deleteCancelButton = deleteModal.querySelector(".cancel__button");
let selectedCard, selectedCardId;

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "774bd1a8-6d8a-4c66-ba75-7308ebd7fe42",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.prepend(cardElement);
    });
  })
  .catch(console.error);
api
  .getUserInfo()
  .then(({ name, about, image }) => {
    (profileDescription.textContent = about),
      (profileName.textContent = name),
      (image = avatarImg);
    console.log(image);
  })
  .catch(console.error);

modals.forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target === modal) {
      closeModal(modal);
    }
  });
});
function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  cardElement.dataset.id = data.id;
  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.alt = data.name;

  const cardLikeButtonEl = cardElement.querySelector(".card__like-button");
  cardLikeButtonEl.addEventListener("click", (evt) => {
    handleCardLike(evt, data._id);
  });
  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");
  cardDeleteBtn.addEventListener("click", (evt) =>
    handleDeleteCard(cardElement, data._id)
  );

  cardImageElement.addEventListener("click", () => {
    previewImage.src = data.link;
    previewImage.alt = data.name;
    previewCaption.textContent = data.name;

    openModal(previewModal);
  });

  return cardElement;
}
closePreviewModal.addEventListener("click", function () {
  closeModal(previewModal);
});

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscape);
}
function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscape);
}

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(".modal_opened");
    closeModal(openedPopup);
  }
}

function handleCardLike(evt, id) {
  const isLiked = evt.target.classList.contains("card__like-button_active");
  const likeButton = evt.target;
  api
    .changeLikeStatus(id, isLiked)
    .then((response) => {
      if (isLiked === true) {
        evt.target.classList.remove("card__like-button_active");
      } else {
        evt.target.classList.add("card__like-button_active");
      }
    })
    .catch(console.error);
}
function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.submitter;
  setButtonText(submitButton, true);
  api
    .editUserInfo({
      name: nameInput.value,
      about: descriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false);
    });
}

function handlePostFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  setButtonText(submitButton, true);
  api
    .addCards({ name: postCaptionInput.value, link: postLinkInput.value })
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      evt.target.reset();
      disableButton(cardSubmitButton, settings);
      closeModal(newPostModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false);
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  setButtonText(submitButton, true);
  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      avatarImg.src = data.avatar;
      closeModal(editAvatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitButton, false);
    });
}
//delete functions

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error);
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

profileEditBtn.addEventListener("click", function () {
  nameInput.value = profileName.textContent;
  descriptionInput.value = profileDescription.textContent;
  resetValidation(editProfileModal, [nameInput, descriptionInput], settings);
  openModal(editProfileModal);
});

closeProfileModal.addEventListener("click", function () {
  closeModal(editProfileModal);
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

closePostModal.addEventListener("click", function () {
  closeModal(newPostModal);
});

avatarModalButton.addEventListener("click", function () {
  openModal(editAvatarModal);
});

avatarCloseButton.addEventListener("click", function () {
  closeModal(editAvatarModal);
});
editFormElement.addEventListener("submit", handleProfileFormSubmit);

avatarForm.addEventListener("submit", handleAvatarSubmit);

postFormEL.addEventListener("submit", handlePostFormSubmit);

deleteForm.addEventListener("submit", handleDeleteSubmit);

enableValidation(settings);
