import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { useLocation, useNavigate } from 'react-router-dom';

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  event.preventDefault();
}

const Breadcrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathSegments = location.pathname.split('/').filter((segment) => segment && segment !== 'edit'); ;

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
              style={{ pointerEvents: isLastSegment ? 'none' : 'auto' }}
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
