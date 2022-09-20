
{
    const styleLink = document.createElement('link');
    styleLink.setAttribute('rel', 'stylesheet');
    styleLink.setAttribute('href', 'https://cdn.jsdelivr.net/gh/sidarilaslan/timeline/css/timeline.min.css');
    document.head.appendChild(styleLink);
}


async function fetchUserData(user) {
    return await fetch(`https://api.github.com/users/${user}`)
        .then(data => data.json())
        .then(data => data);
}

async function fetchUserEvents(user) {
    return await fetch(`https://api.github.com/users/${user}/events`)
        .then(data => data.json())
        .then(data => data);
}

function changeTheme(input) {
    const container = document.querySelector(".container");
    input.addEventListener('change', () => {
        container.classList.toggle('dark-mode');
    }, { once: true });

}

async function setContainerSize(width, height, container) {
    if (width)
        container.style.setProperty('--container-width', width);
    if (height)
        container.style.setProperty('--colon-height', height);
}

async function createEventElement(events, user) {
    const eventsCol = document.querySelector(".col");
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };

    if (!events.length) {
        eventsCol.innerHTML = `<div class="not-found">Event Not Found</div>`;
        return;
    }

    events.forEach(event => {
        const userAvatar = event.org ? event.org.avatar_url : event.actor.avatar_url;
        const repoOwner = (event.repo.name).split("/")[0];
        const userName = user.name ? user.name : user.login;
        const repoDate = new Date(event.created_at).toLocaleDateString("en-US", dateOptions);

        const html = ` 
            <div class="row">
            <div class="image">
                <img src="${userAvatar}" alt="image">
            </div>
            <div class="text-container">
                <div class="user-name">${repoOwner}</div>
                <div class="method">${userName} ${event.payload.action ? event.payload.action : ""}
                 ${event.type.replace("Event", "")}</div>
                <div class="adress">to:<a href="https://github.com/${event.repo.name}" target="_blank">${event.repo.name}</a>
                </div>
            </div>
            <div class="date">${repoDate}</div>
        </div>
        `;
        eventsCol.innerHTML += html;
    });
}

async function createFrame(timeline, user) {
    const userName = user.login ? user.login : null;
    const githubLink = userName ? `<a href="https://github.com/${userName}" target="_blank">@${userName}</a>` : `<a href = "javascript:void(0)"> @UserNotFound</a>`;
    const html = `
    <div class="container">
    <div class="header">
        <div class="title">
        ${githubLink}
        </div>
        <div class="weatherMode">
            <input type="checkbox" class="checkbox" id="checkbox" onclick="changeTheme(this)">
            <label for="checkbox" class="label">
                <div class='ball'></div>
            </label>
        </div>
    </div>
    <div class="col">
    </div>
    <div class="footer">
        Github Timeline
    </div>
</div>
`;
    timeline.innerHTML = html;
}

async function createPage() {
    const timeline = document.querySelector("._timeline");
    const dataset = timeline.dataset;
    const userData = await fetchUserData(dataset.user);
    const userEventsData = await fetchUserEvents(dataset.user);

    await setContainerSize(dataset.width, dataset.height, timeline);
    await createFrame(timeline, userData);
    await createEventElement(userEventsData, userData);
}

document.onload = createPage();

