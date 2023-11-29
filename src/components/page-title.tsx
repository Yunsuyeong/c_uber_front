import { Helmet } from "react-helmet-async";

interface IPageTitle {
  title: string;
}

const PageTitle: React.FC<IPageTitle> = ({ title }) => {
  return (
    <Helmet>
      <title>{title} | Uber</title>
    </Helmet>
  );
};

export default PageTitle;
