/* Layout */
html,
body {
  overflow: hidden;
}

ul {
  padding: 0;
  margin: 0;
}

li {
  display: block;
}

div#app {
  height: 100%;
  cursor: default;
  user-select: none;
  -webkit-user-select: none;
}

div#app:empty:before {
  content: '';
  width: var(--size-medium);
  height: var(--size-medium);
  position: absolute;
  top: calc(50% - var(--size-xsmall));
  left: calc(50% - var(--size-xsmall));
  background: var(--figma-color-icon);
  mask-position: center;
  -webkit-mask-position: center;
  mask-image: url('data:image/svg+xml;charset=utf8,%3Csvg%20fill%3D%22none%22%20height%3D%2232%22%20viewBox%3D%220%200%2032%2032%22%20width%3D%2232%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20clip-rule%3D%22evenodd%22%20d%3D%22m15.1645%208.52993c.0489.27178-.1318.53173-.4036.58061-1.3104.23568-2.5265.84022-3.5054%201.74266-.979.9025-1.68029%202.0654-2.0216%203.3524s-.3085%202.6446.09459%203.9136%201.15971%202.3967%202.18121%203.2508c1.0214.8541%202.2652%201.3992%203.5855%201.5713s2.6623-.0359%203.8685-.5997c1.2063-.5637%202.2267-1.4598%202.9416-2.583.715-1.1233%201.0947-2.4271%201.0947-3.7586%200-.2761.2239-.5.5-.5s.5.2239.5.5c0%201.5217-.434%203.0118-1.251%204.2955-.8171%201.2837-1.9833%202.3078-3.3619%202.9521-1.3785.6442-2.9122.882-4.4211.6853-1.509-.1967-2.9305-.8196-4.0978-1.7958-1.16736-.9761-2.0321-2.2649-2.49278-3.7152-.46068-1.4502-.49818-3.0018-.10811-4.4726.39007-1.4709%201.19154-2.8%202.31039-3.8313%201.1188-1.03141%202.5086-1.72232%204.0062-1.99167.2718-.04888.5317.13181.5806.4036z%22%20fill%3D%22%23000%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E');
  -webkit-mask-image: url('data:image/svg+xml;charset=utf8,%3Csvg%20fill%3D%22none%22%20height%3D%2232%22%20viewBox%3D%220%200%2032%2032%22%20width%3D%2232%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20clip-rule%3D%22evenodd%22%20d%3D%22m15.1645%208.52993c.0489.27178-.1318.53173-.4036.58061-1.3104.23568-2.5265.84022-3.5054%201.74266-.979.9025-1.68029%202.0654-2.0216%203.3524s-.3085%202.6446.09459%203.9136%201.15971%202.3967%202.18121%203.2508c1.0214.8541%202.2652%201.3992%203.5855%201.5713s2.6623-.0359%203.8685-.5997c1.2063-.5637%202.2267-1.4598%202.9416-2.583.715-1.1233%201.0947-2.4271%201.0947-3.7586%200-.2761.2239-.5.5-.5s.5.2239.5.5c0%201.5217-.434%203.0118-1.251%204.2955-.8171%201.2837-1.9833%202.3078-3.3619%202.9521-1.3785.6442-2.9122.882-4.4211.6853-1.509-.1967-2.9305-.8196-4.0978-1.7958-1.16736-.9761-2.0321-2.2649-2.49278-3.7152-.46068-1.4502-.49818-3.0018-.10811-4.4726.39007-1.4709%201.19154-2.8%202.31039-3.8313%201.1188-1.03141%202.5086-1.72232%204.0062-1.99167.2718-.04888.5317.13181.5806.4036z%22%20fill%3D%22%23000%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E');
  animation: rotating 1s linear infinite;
}

div#app.dragged-ghost {
  cursor: grabbing;
}

main {
  height: inherit;
  display: flex;
  flex-direction: column;
}

/* Actions */
div.actions {
  width: 100%;
  height: var(--size-xxlarge);
  padding: var(--size-xsmall);
  border-top: 1px solid var(--figma-color-border);
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  gap: var(--size-xxsmall);
}

div.actions__right {
  display: flex;
  gap: var(--size-xxsmall);
}

div.actions__left {
  display: flex;
  align-items: center;
  gap: var(--size-xxsmall);
}

/* Layout */
section.controller {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

div.controls {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

div.controls__control {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
  overflow: hidden;
}

div.controls__control--horizontal {
  flex-direction: row;
}

div.control__block {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
  padding: var(--size-xxsmall) 0;
  overflow-y: auto;
}

div.control__block--list {
  padding: var(--size-xxsmall) 0 0 0;
}

div.control__block--no-padding {
  padding: 0;
}

div.control__block--distributed {
  justify-content: space-between;
  overflow-y: revert;
}

div.controls__control--horizontal div.control__block {
  align-self: stretch;
div.section-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--size-xsmall);
}

div.controls__control--horizontal .control__block + .control__block {
  border-left: 1px solid var(--figma-color-border-disabled);
}

div.control__block__loader {
  margin: auto;
}

div.section-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--size-xsmall);
  height: var(--size-medium);
}

div.section-controls__left-part {
  display: flex;
  align-items: baseline;
  flex: 1;
}
div.section-controls__right-part {
  display: flex;
}

div.section-controls .section-title,
div.section-controls .label {
  width: auto;
}

/* Export */
div.export-palette__preview {
  padding: 0 var(--size-xsmall);
  flex: 1;
  display: grid;
}

div.export-palette__preview textarea {
  height: 100%;
  margin: 0;
}

/* Settings */
div.settings__group {
  padding: var(--size-xxsmall) 0;
  display: flex;
  flex-direction: column;
  gap: var(--size-xxxsmall);
}

div.settings__group + div.settings__group {
  border-top: 1px solid var(--figma-color-border);
}

div.settings__item {
  padding: 0 var(--size-xsmall);
}

/* About */
div.about {
  flex-direction: row;
  padding: var(--size-xsmall) var(--size-small);
  justify-content: center;
  align-items: center;
}

div.about > div {
  display: flex;
  flex-direction: column;
  gap: var(--size-xxsmall);
}

div.about p {
  margin: 0;
}

div.about__basic {
  display: flex;
  align-items: center;
  gap: var(--size-xsmall);
}

div.about__info {
  display: flex;
  align-items: center;
  color: var(--figma-color-text);
}

div.about__links {
  display: flex;
  align-items: center;
  color: var(--figma-color-text);
}

@media (max-width: 460px) {
  .ui > .bar.recharged {
    flex-direction: column;
    padding-top: var(--size-xxxsmall) !important;
    padding-bottom: var(--size-xxxsmall) !important;
  }
}
