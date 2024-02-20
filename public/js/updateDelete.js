document.querySelector("#update").addEventListener("click", event => {
    event.preventDefault();
    const blogId = document.querySelector("#hiddenBlogId").value;
    const editBlog = {
        title: document.querySelector("#editedTitle").value,
        content: document.querySelector("#editedContent").value,
    };
    console.log(blogId);
    console.log(editBlog);
    fetch(`/api/blogs/${blogId}`, {
        method: "PUT",
        body: JSON.stringify(editBlog),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => {
        if (res.ok) {
            console.log("Blog updated");
            location.href = "/dashboard";
        } else {
            throw new Error("Failed to update blog");
        }
    })
    .catch(error => {
        console.error("Update failed:", error);
        alert("Failed to update blog. Please try again.");
    });
});

document.querySelector("#delete").addEventListener("click", event => {
    event.preventDefault();
    const blogId = document.querySelector("#hiddenBlogId").value;
    if (confirm("Are you sure you want to delete this blog post?")) {
        fetch(`/api/blogs/${blogId}`, {
            method: "DELETE"
        })
        .then(res => {
            if (res.ok) {
                console.log("Blog deleted");
                location.href = "/dashboard";
            } else {
                throw new Error("Failed to delete blog");
            }
        })
        .catch(error => {
            console.error("Delete failed:", error);
            alert("Failed to delete blog. Please try again.");
        });
    }
});
