import { Switch, Route, Redirect } from 'react-router-dom';
import { List } from './List';
import { EditPage } from './EditPage';

const Routing = () => {
  return (
    <Switch>
      <Route exact path={['', '/list']} component={List} />
      <Route path="/template/:templateId" component={EditPage} />
      <Route path="*">
        <Redirect to="/" />
      </Route>
    </Switch>
  );
};

export { Routing };
