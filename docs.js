function copyCode(btn) {
  const pre = btn.closest(".code-wrap")?.querySelector("pre");
  if (!pre || !navigator.clipboard) {
    return;
  }

  navigator.clipboard.writeText(pre.innerText).then(() => {
    btn.textContent = "Copied!";
    setTimeout(() => {
      btn.textContent = "Copy";
    }, 2000);
  });
}

function setActiveNavLink(id, links) {
  links.forEach((link) => {
    link.classList.remove("active");
    link.removeAttribute("aria-current");
  });

  const target = document.querySelector(`.nav-link[href="#${id}"]`);
  if (target) {
    target.classList.add("active");
    target.setAttribute("aria-current", "page");
  }
}

function initDocsNavigation() {
  const sections = document.querySelectorAll(".doc-section[id]");
  const links = document.querySelectorAll(".nav-link");
  if (!sections.length || !links.length) {
    return;
  }

  let lockUntil = 0;

  links.forEach((link) => {
    link.addEventListener("click", () => {
      const id = link.getAttribute("href")?.slice(1);
      if (!id) {
        return;
      }

      setActiveNavLink(id, links);
      lockUntil = Date.now() + 1500;
    });
  });

  function updateOnScroll() {
    if (Date.now() < lockUntil) {
      return;
    }

    const scrollPos = window.scrollY + 120;
    let current = sections[0].id;

    sections.forEach((section) => {
      if (section.offsetTop <= scrollPos) {
        current = section.id;
      }
    });

    setActiveNavLink(current, links);
  }

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateOnScroll();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  updateOnScroll();
}

window.copyCode = copyCode;
document.addEventListener("DOMContentLoaded", initDocsNavigation);
