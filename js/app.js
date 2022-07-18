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

function createFrame(timeLine, user) {
    const html = `
    <div class="_container">
    <div class="_header">
        <div class="_title">
            <a href="https://github.com/${user.login}" target="_blank">@${user.login}</a>
        </div>
        <div class="_weatherMode">
            <input type="checkbox" class="_checkbox" id="_checkbox" onclick="changeTheme(this)">
            <label for="_checkbox" class="_label">
                <div class='_ball'></div>
            </label>
        </div>
    </div>
    <div class="_col">
    </div>
    <div class="_footer">
        footer text here
    </div>
</div>
`;
    timeLine.innerHTML = html;

}

function createEventElement(events, user) {
    const eventsCol = document.querySelector("._col");
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };

    events.forEach(event => {
        const userAvatar = event.org ? event.org.avatar_url : event.actor.avatar_url;
        const repoOwner = (event.repo.name).split("/")[0];
        const repoDate = new Date(event.created_at).toLocaleDateString("en-US", dateOptions);

        const html = ` 
            <div class="_row">
            <div class="_image">
                <img src="${userAvatar}" alt="image">
            </div>
            <div class="_text-container">
                <div class="_user-name">${repoOwner}</div>
                <div class="_method">${user.name} ${event.payload.action ? event.payload.action : ""}
                 ${event.type.replace("Event", "")}</div>
                <div class="_adress">to:<a href="https://github.com/${event.repo.name}" target="_blank">${event.repo.name}</a>
                </div>
            </div>
            <div class="_date">${repoDate}</div>
        </div>
        `;
        eventsCol.innerHTML += html;

    });

}

async function createPage() {
    const timeLine = document.querySelector(".timeline");
    const userData = await fetchUserData(timeLine.dataset.user);
    const userEventsData = await fetchUserEvents(timeLine.dataset.user);

    console.log("%j", userData);
    console.log("%j", userEventsData);

    createFrame(timeLine, userData);
    createEventElement(userEventsData, userData);

}

function changeTheme(input) {
    const container = document.querySelector("._container");
    input.addEventListener('change', () => {
        container.classList.toggle('_dark-mode');

    }, { once: true });

}

createPage();