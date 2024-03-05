const apiUrl = "https://openapi.programming-hero.com/api/retro-forum/posts";
const latesPostApiUrl = "https://openapi.programming-hero.com/api/retro-forum/latest-posts";
let selectedPosts = [];

async function fetchPosts() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.posts;
    } catch (error) {
        console.error("Error fetching posts:", error);
        return null;
    }
}

async function fetchLatestPosts() {
    try {
        const response = await fetch(latesPostApiUrl);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error fetching posts:", error);
        return null;
    }
}

function displayLatestPosts(posts) {
    const postsContainer = document.getElementById("latestPostContainer");
    postsContainer.innerHTML = "";
    let designation = "";
    let postedDate = "";

    posts.forEach((post) => {
        designation = post.author.designation ?? "unknown";
        postedDate = post.author.posted_date ?? "unknown";
        const postDiv = document.createElement("div");
        postDiv.classList.add("col-sm-4", "mb-3");

        postDiv.innerHTML = `
                            <div class="text-white single-latest-post p-4">
                                <div class="row justify-content-center">
                                    <img src="${post.cover_image}" alt="" class="latest-image" />
                                </div>
                                <div class="row mt-4">
                                    <div class="col-12 d-flex justify-content-start align-items-center">
                                        <i class="fa-regular fa-calendar me-2" style="color: #c0c0c0"></i>
                                        <span class="latest-post-date">${postedDate}</span>
                                    </div>
                                </div>
                                <div class="row mt-3 mb-1">
                                    <h3 class="latest-post-heading">
                                        ${post.title}
                                    </h3>
                                </div>
                                <div class="row mt-1">
                                    <p class="latest-post-pragraph">
                                    ${post.description}
                                    </p>
                                </div>
                                <div class="row mt-2">
                                    <div class="col-2 d-flex justify-content-center p-0">
                                        <img src="${post.profile_image}" alt="" class="latest-author-image" />
                                    </div>
                                    <div class="col-8 d-flex justify-content-start">
                                        <div class="row">
                                            <h3 class="latest-author-name">${post.author.name}</h3>
                                            <p class="latest-author-designaation">${designation}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>                        
                        `;

        postsContainer.appendChild(postDiv);
    });
}

function displayPosts(posts) {
    const postsContainer = document.getElementById("postsContainer");
    postsContainer.innerHTML = "";

    posts.forEach((post) => {
        let bgDot = "";
        if (post.isActive == true) {
            bgDot = "bg-success";
        } else if (post.isActive == false) {
            bgDot = "bg-danger";
        }

        const postDiv = document.createElement("div");
        postDiv.classList.add("col-12", "d-flex", "single-post", "py-5", "mb-5");

        postDiv.innerHTML = `<div class="col-md-2 col-sm-12 d-flex justify-content-end pe-4">
                                <div class="single-post-image-container">
                                    <img src="${post.image}" class="single-post-image" />
                                    <div class="single-post-image-dot ${bgDot}"></div>
                                </div>
                            </div>
                            <div class="col-md-10 col-sm-12 pe-5">
                                <div class="row">
                                    <div class="col-12 d-flex">
                                        <p class="me-5 post-category">#${post.category}</p>
                                        <p class="post-author">Author: ${post.author.name}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <h3 class="single-post-title">${post.title}</h3>
                                </div>
                                <div class="row mt-2">
                                    <p class="single-post-description">
                                    ${post.description}
                                    </p>
                                </div>
                                <hr class="single-post-divider mt-1" />
                                <div class="row">
                                    <div class="col-8 d-flex align-items-center">
                                        <img
                                            src="./assets/images/singlePost/comment.png"
                                            class="single-post-stats-icons me-2"
                                            alt=""
                                        />
                                        <span class="single-post-stats me-3">${post.comment_count}</span>
                                        <img
                                            src="./assets/images/singlePost/view.png"
                                            class="single-post-stats-icons me-2"
                                            alt=""
                                        />
                                        <span class="single-post-stats me-3">${post.view_count}</span>
                                        <img
                                            src="./assets/images/singlePost/modified.png"
                                            class="single-post-stats-icons me-2"
                                            alt=""
                                        />
                                        <span class="single-post-stats me-3">${post.posted_time}</span>
                                    </div>
                                    <div class="col-4 d-flex justify-content-end button-container select-button">
                                        <div onclick="togglePostSelection(${post.id})"><img src="./assets/images/select.png" alt="" /></div>
                                    </div>
                                </div>
                            </div>`;

        postsContainer.appendChild(postDiv);
    });
}

function searchPosts(event) {
    event.preventDefault();

    const categoryInput = document.getElementById("categoryInput");
    const searchCategory = categoryInput.value.trim().toLowerCase();

    const spinner = document.getElementById("spinner");
    postsContainer.innerHTML = "";
    spinner.style.display = "block";

    fetchPosts()
        .then((posts) => {
            setTimeout(() => {
                spinner.style.display = "none";

                if (searchCategory === "") {
                    if (posts) {
                        displayPosts(posts);
                    } else {
                        const postsContainer = document.getElementById("postsContainer");
                        postsContainer.innerHTML = "<p>No posts available.</p>";
                    }
                } else {
                    if (posts) {
                        const filteredPosts = posts.filter((post) => post.category.toLowerCase() === searchCategory);
                        if (filteredPosts.length > 0) {
                            displayPosts(filteredPosts);
                        } else {
                            const postsContainer = document.getElementById("postsContainer");
                            postsContainer.innerHTML = "<p>No posts found for the specified category.</p>";
                        }
                    } else {
                        const postsContainer = document.getElementById("postsContainer");
                        postsContainer.innerHTML = "<p>No posts available.</p>";
                    }
                }
            }, 1000);
        })
        .catch((error) => {
            console.error("Error:", error);
            const postsContainer = document.getElementById("postsContainer");
            postsContainer.innerHTML = "<p>Error fetching posts. Please try again later.</p>";
            spinner.style.display = "none";
        });
}

fetchPosts()
    .then((posts) => {
        if (posts) {
            displayPosts(posts);
        } else {
            const postsContainer = document.getElementById("postsContainer");
            postsContainer.innerHTML = "<p>No posts available.</p>";
        }
    })
    .catch((error) => {
        console.error("Error:", error);
        const postsContainer = document.getElementById("postsContainer");
        postsContainer.innerHTML = "<p>Error fetching posts. Please try again later.</p>";
    });

fetchLatestPosts()
    .then((posts) => {
        if (posts) {
            displayLatestPosts(posts);
        } else {
            const postsContainer = document.getElementById("postsContainer");
            postsContainer.innerHTML = "<p>No posts available.</p>";
        }
    })
    .catch((error) => {
        console.error("Error:", error);
        const postsContainer = document.getElementById("postsContainer");
        postsContainer.innerHTML = "<p>Error fetching posts. Please try again later.</p>";
    });

async function togglePostSelection(postId) {
    const apiResult = await fetchPosts();
    if (!apiResult) return;
    const post = apiResult.find((p) => p.id === postId);
    const index = selectedPosts.findIndex((p) => p.id === postId);
    if (index === -1) {
        selectedPosts.push(post);
    } else {
        selectedPosts.splice(index, 1);
    }
    displaySelectedPosts();
}

function displaySelectedPosts() {
    const selectedPostsContainer = document.getElementById("selectedPosts");
    selectedPostsContainer.innerHTML = "";

    const countDiv = document.getElementById("SelectedPostsCount");
    countDiv.textContent = ` (${selectedPosts.length})`;

    selectedPosts.forEach((post) => {
        const singleListPost = document.createElement("div");
        singleListPost.classList.add("col-12", "d-flex", "justify-content-between", "single-list-post", "py-2", "mb-3");

        singleListPost.innerHTML = `<div class="col-8 single-list-post-heading">${post.title}</div>
                                    <div class="col-4 d-flex justify-content-end align-items-center">
                                        <img src="./assets/images/singlePost/view.png" class="single-post-stats-icons me-2" alt="" />
                                        <span class="single-post-stats">${post.view_count}</span>
                                    </div>`;
        selectedPostsContainer.appendChild(singleListPost);
    });
}
