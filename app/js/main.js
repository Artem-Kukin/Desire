$(".mobile").on("click", () => {
  $(".wrapper").addClass("menu-active");
  $(".mobile-menu").css({ visibility: "visible" });
});

$(".btn-close").on("click", () => {
  $(".wrapper").removeClass("menu-active");
  $(".mobile-menu").css({ visibility: "hidden" });
});
