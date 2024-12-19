import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { useLocation, useNavigate } from 'react-router-dom';

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  event.preventDefault();
}

const Breadcrumb = ({ documentName }: { documentName?: string }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathSegments = location.pathname.split('/').filter((segment) => segment && segment !== 'edit'); 
  if(parseInt(pathSegments[pathSegments.length-1])){
    pathSegments.pop()
    pathSegments.push(documentName || "");
  }
  
  const buildPath = (index: number) =>
    `/${pathSegments.slice(0, index + 1).join('/')}`;
  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs aria-label="breadcrumb">
        {pathSegments.map((segment, index) => {
          const fullPath = buildPath(index);
          const isLastSegment = index === pathSegments.length - 1;
          return (
            <Link
              key={fullPath}
              underline="hover"
              color={isLastSegment ? 'primary' : 'inherit'}
              href={fullPath}
              onClick={(e) => {
                e.preventDefault();
                navigate(fullPath);
              }}
              className={isLastSegment ? 'breadcrumb-hide' : 'breadcrumb-visible'}
            >
              {segment.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase())}
            </Link>
          );
        })}
      </Breadcrumbs>
    </div>
  )
}

export default Breadcrumb
