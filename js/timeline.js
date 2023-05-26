
const styleLink = document.createElement('link');
styleLink.setAttribute('rel', 'stylesheet');
styleLink.setAttribute('href', 'https://cdn.jsdelivr.net/gh/sidarilaslan/timeline/css/timeline.min.css');
document.head.appendChild(styleLink);

async function fetchUserData(user) {
  const response = await fetch(`https://api.github.com/users/${user}`);
  const data = await response.json();
  return data;
}

async function fetchUserEvents(user) {
  const response = await fetch(`https://api.github.com/users/${user}/events`);
  const data = await response.json();
  return data;
}

function changeTheme() {
  const container = document.querySelector(".container");
  container.classList.toggle('dark-mode');
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
  const fragment = document.createDocumentFragment();

  if (!events.length) {
    const notFoundDiv = document.createElement('div');
    notFoundDiv.className = 'not-found';
    notFoundDiv.textContent = 'Event Not Found';
    fragment.appendChild(notFoundDiv);
  } else {
    events.forEach(event => {
      const userAvatar = event.org ? event.org.avatar_url : event.actor.avatar_url;
      const repoOwner = event.repo.name.split("/")[0];
      const userName = user.name ? user.name : user.login;
      const repoDate = new Date(event.created_at).toLocaleDateString("en-US", dateOptions);

      const rowDiv = document.createElement('div');
      rowDiv.className = 'row';

      const imageDiv = document.createElement('div');
      imageDiv.className = 'image';
      const img = document.createElement('img');
      img.src = userAvatar;
      img.alt = 'image';
      imageDiv.appendChild(img);

      const textContainerDiv = document.createElement('div');
      textContainerDiv.className = 'text-container';
      const userNameDiv = document.createElement('div');
      userNameDiv.className = 'user-name';
      userNameDiv.textContent = repoOwner;
      const methodDiv = document.createElement('div');
      methodDiv.className = 'method';
      methodDiv.textContent = `${userName} ${event.payload.action ? event.payload.action : ""} ${event.type.replace("Event", "")}`;
      const adressDiv = document.createElement('div');
      adressDiv.className = 'adress';
      const repoLink = document.createElement('a');
      repoLink.href = `https://github.com/${event.repo.name}`;
      repoLink.target = '_blank';
      repoLink.textContent = event.repo.name;
      adressDiv.appendChild(repoLink);
      textContainerDiv.appendChild(userNameDiv);
      textContainerDiv.appendChild(methodDiv);
      textContainerDiv.appendChild(adressDiv);

      const dateDiv = document.createElement('div');
      dateDiv.className = 'date';
      dateDiv.textContent = repoDate;

      rowDiv.appendChild(imageDiv);
      rowDiv.appendChild(textContainerDiv);
      rowDiv.appendChild(dateDiv);

      fragment.appendChild(rowDiv);
    });
  }

  eventsCol.appendChild(fragment);
}
async function createFrame(timeline, user) {
  const userName = user.login ? user.login : null;
  const githubLink = userName ? `<a href="https://github.com/${userName}" target="_blank">@${userName}</a>` : `<a href="javascript:void(0)"> @UserNotFound</a>`;

  const fragment = document.createDocumentFragment();

  const container = document.createElement('div');
  container.className = 'container';

  const header = document.createElement('div');
  header.className = 'header';

  const title = document.createElement('div');
  title.className = 'title';
  title.innerHTML = githubLink;

  const weatherMode = document.createElement('div');
  weatherMode.className = 'weatherMode';

  const checkboxInput = document.createElement('input');
  checkboxInput.type = 'checkbox';
  checkboxInput.className = 'checkbox';
  checkboxInput.id = 'checkbox';

  checkboxInput.addEventListener('click', () => {
    changeTheme();
  });

  const checkboxLabel = document.createElement('label');
  checkboxLabel.className = 'label';
  checkboxLabel.htmlFor = 'checkbox';

  const ballDiv = document.createElement('div');
  ballDiv.className = 'ball';

  checkboxLabel.appendChild(ballDiv);
  weatherMode.appendChild(checkboxInput);
  weatherMode.appendChild(checkboxLabel);

  header.appendChild(title);
  header.appendChild(weatherMode);

  const col = document.createElement('div');
  col.className = 'col';

  const footer = document.createElement('div');
  footer.className = 'footer';
  footer.textContent = 'Github Timeline';

  container.appendChild(header);
  container.appendChild(col);
  container.appendChild(footer);

  fragment.appendChild(container);

  timeline.appendChild(fragment);
}


async function createTimeline() {
  const timeline = document.getElementById("timeline");
  const dataset = timeline.dataset;
  const [userData, userEventsData] = await Promise.all([
    fetchUserData(dataset.user),
    fetchUserEvents(dataset.user)
  ]);

  await setContainerSize(dataset.width, dataset.height, timeline);
  await createFrame(timeline, userData);
  await createEventElement(userEventsData, userData);
}

(() => {
  createTimeline();
})();
