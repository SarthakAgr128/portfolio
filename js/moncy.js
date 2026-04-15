const cursorDot = document.querySelector(".cursor__dot");
const cursorRing = document.querySelector(".cursor__ring");
const orb = document.getElementById("orb");

document.addEventListener("mousemove", (event) => {
  cursorDot.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
  cursorRing.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
});

const floatingCard = document.querySelector(".floating-card");

floatingCard.addEventListener("mousemove", (event) => {
  const rect = floatingCard.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const midX = rect.width / 2;
  const midY = rect.height / 2;
  const rotateX = -(y - midY) / 20;
  const rotateY = (x - midX) / 20;
  floatingCard.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

floatingCard.addEventListener("mouseleave", () => {
  floatingCard.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
});

let orbRotation = 0;
const animateOrb = () => {
  orbRotation += 0.4;
  orb.style.transform = `translate(-50%, -50%) rotate(${orbRotation}deg)`;
  requestAnimationFrame(animateOrb);
};
animateOrb();
