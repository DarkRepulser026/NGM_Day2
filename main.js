async function LoadData() {
    let res = await fetch("http://localhost:3001/posts")
    let posts = await res.json();
    let body = document.getElementById("body_table");
    body.innerHTML = '';
    for (const post of posts) {
        let isDeleted = post.isDeleted === true;
        let rowStyle = isDeleted ? 'style="text-decoration: line-through; color: gray;"' : '';
        body.innerHTML += `<tr ${rowStyle}>
            <td>${post.id}</td>
            <td>${post.title}</td>
            <td>${post.views}</td>
            <td><input type="submit" value="Delete" onclick="Delete('${post.id}')"/></td>
        </tr>`
    }

}
async function Save() {
    let id = document.getElementById("id_txt").value.trim();
    let title = document.getElementById("title_txt").value;
    let views = document.getElementById("view_txt").value;
    if (id) {
        // Update
        let getItem = await fetch('http://localhost:3001/posts/' + id)
        if (getItem.ok) {
            let res = await fetch('http://localhost:3001/posts/' + id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title,
                    views: views
                })
            });
            if (res.ok) {
                console.log("Thanh cong");
            }
        }
    } else {
        // Create new: get max id, auto increment, id is string
        let res = await fetch('http://localhost:3001/posts');
        let posts = await res.json();
        let maxId = 0;
        for (const post of posts) {
            let pid = parseInt(post.id);
            if (!isNaN(pid) && pid > maxId) maxId = pid;
        }
        let newId = (maxId + 1).toString();
        try {
            let res = await fetch('http://localhost:3001/posts', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: newId,
                    title: title,
                    views: views
                })
            });
            if (res.ok) {
                console.log("Thanh cong");
            }
        } catch (error) {
            console.log(error);
        }
    }
    LoadData();
    return false;



}
async function Delete(id) {
    // Soft delete: set isDeleted:true
    let res = await fetch("http://localhost:3001/posts/" + id, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ isDeleted: true })
    });
    if (res.ok) {
        console.log("Xoa mem thanh cong");
    }
    LoadData();
    return false;
}
LoadData();

// ----------- COMMENTS CRUD -----------
async function LoadComments() {
    let res = await fetch("http://localhost:3001/comments");
    let comments = await res.json();
    let body = document.getElementById("comments_table");
    body.innerHTML = '';
    for (const cmt of comments) {
        let isDeleted = cmt.isDeleted === true;
        let rowStyle = isDeleted ? 'style="text-decoration: line-through; color: gray;"' : '';
        body.innerHTML += `<tr ${rowStyle}>
            <td>${cmt.id}</td>
            <td>${cmt.text}</td>
            <td>${cmt.postId}</td>
            <td><input type="submit" value="Delete" onclick="DeleteComment('${cmt.id}')"/></td>
        </tr>`;
    }
}

async function SaveComment() {
    let id = document.getElementById("comment_id_txt").value.trim();
    let text = document.getElementById("comment_text_txt").value;
    let postId = document.getElementById("comment_postid_txt").value;
    if (id) {
        // Update
        let getItem = await fetch('http://localhost:3001/comments/' + id);
        if (getItem.ok) {
            let res = await fetch('http://localhost:3001/comments/' + id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ text, postId })
            });
            if (res.ok) {
                console.log("Update comment success");
            }
        }
    } else {
        // Create new: get max id, auto increment, id is string
        let res = await fetch('http://localhost:3001/comments');
        let comments = await res.json();
        let maxId = 0;
        for (const cmt of comments) {
            let cid = parseInt(cmt.id);
            if (!isNaN(cid) && cid > maxId) maxId = cid;
        }
        let newId = (maxId + 1).toString();
        try {
            let res = await fetch('http://localhost:3001/comments', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: newId, text, postId })
            });
            if (res.ok) {
                console.log("Create comment success");
            }
        } catch (error) {
            console.log(error);
        }
    }
    LoadComments();
    return false;
}

async function DeleteComment(id) {
    // Soft delete: set isDeleted:true
    let res = await fetch("http://localhost:3001/comments/" + id, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ isDeleted: true })
    });
    if (res.ok) {
        console.log("Xoa mem comment thanh cong");
    }
    LoadComments();
    return false;
}

// Call LoadData and LoadComments on window load
window.onload = function() {
    LoadData();
    LoadComments();
}