import { Button } from 'antd';
import styled from 'styled-components';
import { PlusOutlined } from '@ant-design/icons';
import newTemplate from '../../Assets/Images/new_template.svg';
import { useHistory, useLocation, useRouteMatch } from 'react-router';
import { ReactNode } from 'react';

interface PreviewProps {
  image?: string;
  skeleton?: ReactNode;
  id: string;
}

const PreviewContainer = styled.div`
  flex: 1 1 0%;
  border: 0.4px solid rgb(225, 230, 242);
  filter: drop-shadow(rgba(0, 0, 0, 0.08) 4px 4px 4px);
  max-height: 500px;
  min-height: 150px;
  height: min-content;
  max-width: 280px;
  overflow: hidden;
  border-radius: 4px;
  margin-bottom: 25px;
  transition: all 0.2s ease 0s;
  position: relative;
  text-align: center;
  margin: 0 auto;

  .hoverItem {
    display: none;
    position: absolute;
    inset: 0px;
    background: rgba(255, 255, 255, 0.9);
    padding: 20px;
    flex-direction: column;
    .content {
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }

  .hoverItem.alwaysActive {
    display: flex;
    background: unset;
  }

  &:hover {
    box-shadow: rgb(0 0 0 / 15%) 0px 5px 20px;
    .hoverItem {
      display: flex;
    }
  }

  img,
  .newTemplate {
    max-width: 280px;
  }
  .newTemplate {
    max-height: 500px;
    min-height: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 60px;
  }

  .btn-choose {
    padding: 8px 16px;
    text-transform: capitalize;
  }
`;

export const NewItem = () => {
  const history = useHistory();
  const { path } = useRouteMatch();
  const onClick = () => {
    history.push(`${path}/template/new`);
  };

  return (
    <PreviewContainer>
      <div className="newTemplate">
        <PlusOutlined style={{ fontSize: '40px' }} />
      </div>
      <div className="hoverItem alwaysActive">
        <div className="content">
          <Button onClick={onClick} size="large" type="primary" className="btn-choose">
            New Template
          </Button>
        </div>
      </div>
      <div>
        <img src={newTemplate} alt="img new template" />
      </div>
    </PreviewContainer>
  );
};

const Preview = ({ image, id, skeleton }: PreviewProps) => {
  const history = useHistory();
  const { path } = useRouteMatch();
  const onClick = () => {
    history.push(`${path}/template/${id}`);
  };
  return (
    <PreviewContainer>
      {skeleton ? (
        <div style={{ height: '350px', minWidth: '280px', maxWidth: '280px', padding: '24px 24px' }}>{skeleton}</div>
      ) : (
        <img height="350px" src={image} alt="preview" />
      )}
      <div className="hoverItem">
        <div className="content">
          <Button onClick={onClick} size="large" type="primary" className="btn-choose">
            choose
          </Button>
        </div>
      </div>
    </PreviewContainer>
  );
};
export { Preview };
