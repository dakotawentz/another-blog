const existingBlogsSection = document.querySelector("#existingblogs");
const createNewSection = document.querySelector("#createNew");
const newPostForm = document.querySelector("#newpost");
const newBlogForm = document.querySelector('#newBlog');

function hideCreateNew() {
    createNewSection.hidden = true;
}

hideCreateNew();

newPostForm.addEventListener("submit", event => {
    event.preventDefault();
    console.log('New post form submitted');
    existingBlogsSection.hidden = true;
    newPostForm.hidden = true;
    createNewSection.hidden = false;
});

newBlogForm.addEventListener("submit", event => {
    event.preventDefault();
    const title = document.querySelector("#title").value.trim();
    const content = document.querySelector("#content").value.trim();

    if (!title || !content) {
        alert('Please enter both title and content');
        return;
    }

    const blogObj = {
        title: title,
        content: content,
    };

    fetch("/api/blogs", {
        method: "POST",
        body: JSON.stringify(blogObj),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => {
        if (res.ok) {
            createNewSection.setAttribute("hidden", "false");
            location.reload();
        } else {
            throw new Error("Failed to create blog");
        }
    })
    .catch(error => {
        console.error("Blog creation error:", error);
        alert("Failed to create blog. Please try again.");
    });
});
