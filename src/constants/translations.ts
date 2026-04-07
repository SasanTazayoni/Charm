import type { Language } from "@/context/LanguageContext";

type TranslationPair = Record<Language, string>;

function createTranslation(en: string, sr: string): TranslationPair {
  return { English: en, Serbian: sr };
}

export const translations = {
  navbar: {
    about:   createTranslation("About",   "O nama"),
    pricing: createTranslation("Pricing", "Cjenovnik"),
    gallery: createTranslation("Gallery", "Galerija"),
    contact: createTranslation("Contact", "Kontakt"),
  },

  hero: {
    subtitle: createTranslation("Professional Nail Artist", "Profesionalni umjetnik nokta"),
  },

  about: {
    heading: createTranslation("About", "O nama"),
    para1Prefix: createTranslation(
      "Hi, I am Mirjana — a nail artist based in Bijeljina, Bosnia & Herzegovina. Nail art has always been a passion of mine, and I love using my creativity to bring each client's vision to life. With over four years of professional experience and a formally recognised qualification, I am committed to delivering the highest standard of work — as you can see in ",
      "Zdravo, ja sam Mirjana — umjetnica nokta iz Bijeljine, Bosna i Hercegovina. Uljepšavanje nokta oduvijek je bila moja strast, i volim koristiti svoju kreativnost kako bih oživjela viziju svakog klijenta. Sa više od četiri godine profesionalnog iskustva i formalno priznatom kvalifikacijom, posvećena sam pružanju najvišeg standarda rada — kao što možete vidjeti u ",
    ),
    para1LinkText: createTranslation("my certificate", "mom sertifikatu"),
    para2: createTranslation(
      "When I am not at the nail table, I am a proud mum to two beautiful girls. Family is everything to me, and I love nothing more than being there for them and taking care of the people I hold dear. That same warmth and attention carries into everything I do — I treat every client's nails as if they were my own.",
      "Kada nisam za stolom za nokte, ponosna sam mama dviju prelijepih djevojčica. Porodica mi je sve, i ništa me ne usrećuje više nego biti tu za njih i brinuti se o ljudima koji su mi dragi. Ta ista toplina i pažnja prenose se na sve što radim — prema noktima svakog klijenta odnosim se kao prema svojim vlastitim.",
    ),
    para3: createTranslation(
      "Whether you are after a clean, classic look or something bold and creative, every set of nails tells a story. I take the time to understand what each client wants and put my heart into making it happen — because you deserve to leave feeling your best.",
      "Bilo da želite čist, klasičan izgled ili nešto smjelo i kreativno, svaki set nokta priča svoju priču. Uzimam si vremena da razumijem šta svaki klijent želi i ulažem srce u to da se to i ostvari — jer zaslužujete otići osjećajući se najbolje.",
    ),
    closeLabel: createTranslation("Close", "Zatvori"),
    certAlt:    createTranslation("Professional Nail Technology Certificate", "Sertifikat profesionalne tehnologije nokta"),
  },

  pricing: {
    heading:  createTranslation("Pricing", "Cjenovnik"),
    imageAlt: createTranslation("Charm Price List", "Charm Cjenovnik"),
    imageSrcLarge: createTranslation("/pricing.jpg",       "/pricing-serbian.jpg"),
    imageSrcSmall: createTranslation("/pricing-small.png", "/pricing-serbian-small.png"),
  },

  gallery: {
    heading:       createTranslation("Gallery", "Galerija"),
    loadError:     createTranslation("Failed to load photos. Please refresh the page.", "Greška pri učitavanju fotografija. Osvježite stranicu."),
    empty:         createTranslation("No photos yet.", "Još nema fotografija."),
    openPhotoLabel: createTranslation("Open photo", "Otvori fotografiju"),
    photoAlt:      createTranslation("Charm nail art", "Charm umjetnost nokta"),
    instagramText: createTranslation("Check out my Instagram to see more", "Pogledajte moj Instagram za više"),
    closeLabel:    createTranslation("Close", "Zatvori"),
  },

  contact: {
    heading: createTranslation("Contact", "Kontakt"),
  },

  footer: {
    copyright: createTranslation("© 2026 Charm. All rights reserved.", "© 2026 Charm. Sva prava zadržana."),
  },

  languageToggle: {
    currentlyIn:     createTranslation("Currently in", "Trenutno na"),
    currentLanguage: createTranslation("English", "Srpskom"),
    button:          createTranslation("Language", "Jezik"),
  },

  admin: {
    heading:                createTranslation("Gallery Manager", "Upravitelj galerijom"),
    upload:                 createTranslation("Upload", "Dodaj"),
    uploading:              createTranslation("Uploading...", "Učitavanje..."),
    logout:                 createTranslation("Log out", "Odjava"),
    loadError:              createTranslation("Failed to load photos. Please refresh the page.", "Greška pri učitavanju fotografija. Osvježite stranicu."),
    uploadSuccess:          createTranslation("Photo uploaded successfully.", "Fotografija je uspješno dodana."),
    uploadError:            createTranslation("Upload failed. Please try again.", "Došlo je do greške. Pokušajte ponovo."),
    uploadErrorDuplicate:   createTranslation("A photo with that name already exists. Rename the file and try again.", "Fotografija s tim imenom već postoji. Preimenujte fajl i pokušajte ponovo."),
    uploadErrorInvalidFile: createTranslation("Invalid file type. Only JPEG, PNG and WebP are allowed.", "Nevažeći tip fajla. Dozvoljeni su samo JPEG, PNG i WebP."),
    uploadErrorFileTooLarge: createTranslation("File too large. Maximum size is 10MB.", "Fajl je preveć velik. Maksimalna veličina je 10MB."),
    deleteSuccess:          createTranslation("Photo deleted successfully.", "Fotografija je uspješno obrisana."),
    deleteError:            createTranslation("Something went wrong. Please try again.", "Nešto je pošlo po krivu. Pokušajte ponovo."),
    empty:                  createTranslation("No photos yet.", "Još nema fotografija."),
    confirmDelete:          createTranslation("Delete this photo?", "Obrisati ovu fotografiju?"),
    cancel:                 createTranslation("Cancel", "Odustani"),
    delete:                 createTranslation("Delete", "Obriši"),
  },

  notFound: {
    code:    createTranslation("404", "404"),
    heading: createTranslation("Page Not Found", "Stranica nije pronađena"),
    text:    createTranslation("This page doesn't exist — but great nails do.", "Ova stranica ne postoji — ali lijepi nokti postoje."),
    button:  createTranslation("Back to Home", "Nazad na početnu"),
  },

  adminLogin: {
    heading:             createTranslation("Admin", "Administrator"),
    passwordPlaceholder: createTranslation("Password", "Lozinka"),
    errorWrongPassword:  createTranslation("Incorrect password.", "Netačna lozinka."),
    errorServer:         createTranslation("Server error. Please contact the administrator.", "Greška na serveru. Kontaktirajte administratora."),
    errorNoConnection:   createTranslation("No connection. Check your internet and try again.", "Nema veze. Provjerite internet i pokušajte ponovo."),
    errorGeneric:        createTranslation("Something went wrong. Please try again.", "Nešto je pošlo po krivu. Pokušajte ponovo."),
    submit:              createTranslation("Log in", "Prijava"),
    submitting:          createTranslation("Logging in...", "Prijava..."),
  },
};
