# Grouply website (early-stage prototype)

A responsive, single-page landing site for **Grouply: Less Chasing. More Creating.**
Plain HTML, CSS and JavaScript: no build step, no installs, no frameworks.

> Grouply is an early-stage student startup concept. The site shows **proposed** features only.
> The dashboard in the hero uses **made-up sample data**. There are no real users, testimonials,
> ratings, downloads or sign-ups anywhere on the site.

## Files

```
grouply-website/
├── index.html        page structure and content
├── css/styles.css    all styling (colours are CSS variables at the top)
├── js/script.js      navigation, sample dashboard, waitlist form + CONFIG
└── README.md         this file
```

## Run it locally

**Option 1 (simplest):** open the `grouply-website` folder and double-click `index.html`.
It opens in your default browser. (Fonts load from Google Fonts, so you need internet for the
intended typography; offline, the site falls back to your system fonts.)

**Option 2 (local server, closest to a real website):** open a terminal in the folder and run one of:

```bash
# Python 3 (macOS / Linux / Windows)
python3 -m http.server 8000      # on Windows you may need:  python -m http.server 8000

# or Node.js
npx serve .
```

Then visit <http://localhost:8000>. Press `Ctrl + C` in the terminal to stop.

**Option 3:** in VS Code, install the *Live Server* extension, right-click `index.html`, choose *Open with Live Server*.

## The waitlist form: demo mode vs. real mode

Out of the box the form is in **demo mode**:
- It validates the fields (name, phone, college required; email optional; consent required).
- It then shows a clear message that **nothing was sent or saved**.
- A visible "Demo form" notice sits above the fields.

It never claims a submission was saved unless a real service confirms it.

### Connect it to a real form service (Formspree example)

1. Create a free account at <https://formspree.io> and create a new form.
2. Copy the form endpoint (looks like `https://formspree.io/f/abcdwxyz`).
3. Open `js/script.js` and paste it into `CONFIG.formEndpoint`:
   ```js
   const CONFIG = {
     formEndpoint: "https://formspree.io/f/abcdwxyz",
     contactEmail: ""
   };
   ```
4. Reload the site. The demo banner disappears, and submissions arrive in your Formspree
   dashboard (you can export them or forward them to email).
5. Test with your own details first. In live mode the form shows "Thanks, you're on the list"
   only if the service answers with success, and shows a "not saved" error otherwise.

Other options that work the same way (any service that accepts a `POST` of form fields and
returns a success status): Basin, Getform, Web3Forms, Netlify Forms (needs extra attributes on
the `<form>` tag), or your own backend/API endpoint. Google Forms and Google Sheets can also be
used, but they usually need extra setup, and browsers may block you from confirming success, so
check that carefully before relying on them.

### Privacy note

The form collects **phone numbers and college names**, which are personal data. Before you share the
site publicly, decide where the data will be stored, who can see it, and how a person can ask you to
delete it. The consent checkbox wording is: *"I agree to be contacted about Grouply's prototype and
updates."* Only contact people for that purpose.

## Optional: contact email

Set `contactEmail` in `js/script.js` and the footer **Contact** link will open an email draft.
Left empty, it scrolls to the waitlist form.

## Customising

- **Colours:** edit the variables at the top of `css/styles.css` (`--primary`, `--lavender`, `--lilac`, ...).
- **Sample dashboard:** edit the `members` and `tasks` arrays in `js/script.js`. Keep them labelled as sample data.
- **Text:** all copy is in `index.html`.

## Hosting later (optional)

Because it's static, you can drop the folder onto GitHub Pages, Netlify, Vercel or Cloudflare Pages
for free. Keep the "prototype stage" wording and "Proposed" labels until features really exist.
