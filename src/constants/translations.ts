import type { Language } from "@/context/LanguageContext";

type TranslationPair = Record<Language, string>;

function t(en: string, sr: string): TranslationPair {
  return { English: en, Serbian: sr };
}

export const translations = {
  navbar: {
    about:   t("About",   "O nama"),
    pricing: t("Pricing", "Cjenovnik"),
    gallery: t("Gallery", "Galerija"),
    contact: t("Contact", "Kontakt"),
  },

  hero: {
    subtitle: t("Professional Nail Artist", "Profesionalni umjetnik nokta"),
  },

  about: {
    heading: t("About", "O nama"),
    para1Prefix: t(
      "Hi, I am Mirjana — a nail artist based in Bijeljina, Bosnia & Herzegovina. Nail art has always been a passion of mine, and I love using my creativity to bring each client's vision to life. With over four years of professional experience and a formally recognised qualification, I am committed to delivering the highest standard of work — as you can see in ",
      "Zdravo, ja sam Mirjana — umjetnica nokta iz Bijeljine, Bosna i Hercegovina. Uljepšavanje nokta oduvijek je bila moja strast, i volim koristiti svoju kreativnost kako bih oživjela viziju svakog klijenta. Sa više od četiri godine profesionalnog iskustva i formalno priznatom kvalifikacijom, posvećena sam pružanju najvišeg standarda rada — kao što možete vidjeti u ",
    ),
    para1LinkText: t("my certificate", "mom sertifikatu"),
    para2: t(
      "When I am not at the nail table, I am a proud mum to two beautiful girls. Family is everything to me, and I love nothing more than being there for them and taking care of the people I hold dear. That same warmth and attention carries into everything I do — I treat every client's nails as if they were my own.",
      "Kada nisam za stolom za nokte, ponosna sam mama dviju prelijepih djevojčica. Porodica mi je sve, i ništa me ne usrećuje više nego biti tu za njih i brinuti se o ljudima koji su mi dragi. Ta ista toplina i pažnja prenose se na sve što radim — prema noktima svakog klijenta odnosim se kao prema svojim vlastitim.",
    ),
    para3: t(
      "Whether you are after a clean, classic look or something bold and creative, every set of nails tells a story. I take the time to understand what each client wants and put my heart into making it happen — because you deserve to leave feeling your best.",
      "Bilo da želite čist, klasičan izgled ili nešto smjelo i kreativno, svaki set nokta priča svoju priču. Uzimam si vremena da razumijem šta svaki klijent želi i ulažem srce u to da se to i ostvari — jer zaslužujete otići osjećajući se najbolje.",
    ),
    closeLabel: t("Close", "Zatvori"),
    certAlt:    t("Professional Nail Technology Certificate", "Sertifikat profesionalne tehnologije nokta"),
  },

  pricing: {
    heading:  t("Pricing", "Cjenovnik"),
    imageAlt: t("Charm Price List", "Charm Cjenovnik"),
    imageSrcLarge: t("/pricing.jpg",       "/pricing-serbian.jpg"),
    imageSrcSmall: t("/pricing-small.png", "/pricing-serbian-small.png"),
  },

  gallery: {
    heading:       t("Gallery", "Galerija"),
    loadError:     t("Failed to load photos. Please refresh the page.", "Greška pri učitavanju fotografija. Osvježite stranicu."),
    empty:         t("No photos yet.", "Još nema fotografija."),
    openPhotoLabel: t("Open photo", "Otvori fotografiju"),
    photoAlt:      t("Charm nail art", "Charm umjetnost nokta"),
    instagramText: t("Check out my Instagram to see more", "Pogledajte moj Instagram za više"),
    closeLabel:    t("Close", "Zatvori"),
  },

  contact: {
    heading: t("Contact", "Kontakt"),
  },

  footer: {
    copyright: t("© 2026 Charm. All rights reserved.", "© 2026 Charm. Sva prava zadržana."),
  },

  languageToggle: {
    currentlyIn:     t("Currently in", "Trenutno na"),
    currentLanguage: t("English", "Srpskom"),
    button:          t("Language", "Jezik"),
  },

  admin: {
    heading:                t("Gallery Manager", "Upravitelj galerijom"),
    upload:                 t("Upload", "Dodaj"),
    uploading:              t("Uploading...", "Učitavanje..."),
    logout:                 t("Log out", "Odjava"),
    loadError:              t("Failed to load photos. Please refresh the page.", "Greška pri učitavanju fotografija. Osvježite stranicu."),
    uploadSuccess:          t("Photo uploaded successfully.", "Fotografija je uspješno dodana."),
    uploadError:            t("Upload failed. Please try again.", "Došlo je do greške. Pokušajte ponovo."),
    uploadErrorInvalidFile: t("Invalid file type. Only JPEG, PNG and WebP are allowed.", "Nevažeći tip fajla. Dozvoljeni su samo JPEG, PNG i WebP."),
    uploadErrorFileTooLarge: t("File too large. Maximum size is 10MB.", "Fajl je preveć velik. Maksimalna veličina je 10MB."),
    deleteSuccess:          t("Photo deleted successfully.", "Fotografija je uspješno obrisana."),
    deleteError:            t("Something went wrong. Please try again.", "Nešto je pošlo po krivu. Pokušajte ponovo."),
    empty:                  t("No photos yet.", "Još nema fotografija."),
    confirmDelete:          t("Delete this photo?", "Obrisati ovu fotografiju?"),
    cancel:                 t("Cancel", "Odustani"),
    delete:                 t("Delete", "Obriši"),
  },

  adminLogin: {
    heading:             t("Admin", "Administrator"),
    passwordPlaceholder: t("Password", "Lozinka"),
    errorWrongPassword:  t("Incorrect password.", "Netačna lozinka."),
    errorServer:         t("Server error. Please contact the administrator.", "Greška na serveru. Kontaktirajte administratora."),
    errorNoConnection:   t("No connection. Check your internet and try again.", "Nema veze. Provjerite internet i pokušajte ponovo."),
    errorGeneric:        t("Something went wrong. Please try again.", "Nešto je pošlo po krivu. Pokušajte ponovo."),
    submit:              t("Log in", "Prijava"),
    submitting:          t("Logging in...", "Prijava..."),
  },
};
