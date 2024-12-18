document.addEventListener("DOMContentLoaded", () => {
    const toyCollection = document.getElementById("toy-collection");
    const addToyForm = document.querySelector(".add-toy-form");
    const addToyButton = document.querySelector("#new-toy-btn");
    const toyFormContainer = document.querySelector(".container");
    const apiUrl = "http://localhost:3000/toys";
  
    let addToy = false;
  
    // Show or hide the form
    addToyButton.addEventListener("click", () => {
      addToy = !addToy;
      if (addToy) {
        toyFormContainer.style.display = "block";
      } else {
        toyFormContainer.style.display = "none";
      }
    });
  
    // Fetch and render toys
    function fetchToys() {
      fetch(apiUrl)
        .then((response) => response.json())
        .then((toys) => {
          toys.forEach((toy) => renderToyCard(toy));
        });
    }
  
    // Render a single toy card
    function renderToyCard(toy) {
      const toyCard = document.createElement("div");
      toyCard.className = "card";
  
      toyCard.innerHTML = `
        <h2>${toy.name}</h2>
        <img src="${toy.image}" class="toy-avatar" />
        <p>${toy.likes} Likes</p>
        <button class="like-btn" id="${toy.id}">Like ❤️</button>
      `;
  
      // Add event listener for like button
      const likeButton = toyCard.querySelector(".like-btn");
      likeButton.addEventListener("click", () => increaseLikes(toy));
  
      toyCollection.appendChild(toyCard);
    }
  
    // Handle adding a new toy
    addToyForm.addEventListener("submit", (event) => {
      event.preventDefault();
  
      const toyName = event.target.name.value;
      const toyImage = event.target.image.value;
  
      const newToy = {
        name: toyName,
        image: toyImage,
        likes: 0,
      };
  
      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(newToy),
      })
        .then((response) => response.json())
        .then((toy) => {
          renderToyCard(toy); // Add the new toy to the DOM
          addToyForm.reset(); // Clear the form
        });
    });
  
    // Handle increasing likes
    function increaseLikes(toy) {
      const newLikes = toy.likes + 1;
  
      fetch(`${apiUrl}/${toy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ likes: newLikes }),
      })
        .then((response) => response.json())
        .then((updatedToy) => {
          // Update the DOM
          const toyCard = document.getElementById(toy.id).parentElement;
          const likesElement = toyCard.querySelector("p");
          likesElement.textContent = `${updatedToy.likes} Likes`;
        });
    }
  
    // Initial fetch to load toys
    fetchToys();
  });
  