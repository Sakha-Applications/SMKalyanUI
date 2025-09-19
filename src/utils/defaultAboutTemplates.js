// src/utils/defaultAboutTemplates.js

/**
 * Build a friendly, well-formed default "About Yourself" text
 * using already-collected formData. This is called ONLY when
 * formData.aboutBrideGroom is empty.
 */
export function getDefaultAboutText(formData = {}) {
  const {
    gender,
    name,
    education,
    profession,
    designation,
    current_company,
    hobbies,
    currentLocation,          // optional: may be present from Popup1 enrichment
    currentLocationCountry,   // optional: country ISO code/name
  } = formData;

  // Prepare dynamic bits with graceful fallbacks
  const role = (designation || profession || 'professional').toString().trim();
  const company = (current_company || 'my organization').toString().trim();
  const qual = (education || 'my graduation').toString().trim();

  // Hobbies: prefer user-selected list; else a tasteful default set
  const hobbiesList = Array.isArray(hobbies) && hobbies.length > 0
    ? Array.from(new Set(hobbies.map(String))).slice(0, 4).join(', ')
    : 'reading, traveling, music, and fitness';

  // Location (optional, only if we actually have data)
  const whereBits = [];
  if (currentLocation) whereBits.push(currentLocation);
  if (currentLocationCountry) whereBits.push(currentLocationCountry);
  const whereTxt = whereBits.length ? ` in ${whereBits.join(', ')}` : '';

  // Male template (explicit daily practices)
  const maleTemplate = `
I come from a Madhwa Brahmin tradition yet progressive family, and value honesty, humility, and mutual respect.
Outside of work, I enjoy ${hobbiesList}.
I perform daily Sandhyavandana, Saligrama pooja, and observe Ekadashi and other vratas sincerely.
Professionally, I work as a ${role} at ${company}${whereTxt}, and I have completed my ${qual}.
I come from a close-knit, values-driven family and believe in living a balanced life — rooted in our rich heritage while being open-minded and respectful of others.

I'm looking for a life partner who is kind, grounded, and shares similar values. Someone who is career-oriented but also values family life. Compatibility, clear communication, and mutual respect are most important to me.
`.trim();

  // Female template (softer religious line, per your instruction)
  const femaleTemplate = `
I come from a Madhwa Brahmin tradition yet progressive family, and value honesty, humility, and mutual respect.
Beyond work, I enjoy ${hobbiesList}.
I follow our family’s religious practices sincerely and observe important festivals and traditions.
Professionally, I work as a ${role} at ${company}${whereTxt}, and I have completed my ${qual}.
I belong to a close-knit, values-driven family and believe in living a balanced life — rooted in our rich heritage while being open-minded and respectful of others.

I hope to find a life partner who is kind, supportive, and shares similar values. Someone who balances career ambitions with family life. For me, compatibility, clear communication, and mutual respect matter the most.
`.trim();

  // If a name is present, we won’t force it into the first person line
  // to keep the paragraph natural — users usually keep bios in first person.

  // Decide by gender (from Popup1); default to female style if not provided
  const g = (gender || '').toString().toLowerCase();
  return g === 'male' ? maleTemplate : femaleTemplate;
}
