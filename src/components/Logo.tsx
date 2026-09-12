const logoImg = `${import.meta.env.BASE_URL}murban-logo.png`;

const Logo = () => {
  return (
    <img
      src={logoImg}
      alt="MURBAN ENGINEERING logo"
      className="h-9 md:h-12 w-auto object-contain shrink-0"
    />
  );
};

export default Logo;
