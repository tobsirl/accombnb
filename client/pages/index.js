import Layout from '../components/Layout';
import House from '../components/House';
import houses from './houses.json';

const content = (
  <div>
    <h2>Places to stay</h2>

    <div className="houses">
      {houses.map((house, index) => {
        return <House key={index} {...house} />;
      })}
    </div>

    <style jsx>{`
      .houses {
        display: grid;
        grid-template-columns: 50% 50%;
        grid-template-rows: 300px 300px;
        grid-gap: 40px;
      }
    `}</style>
  </div>
);

const Index = () => <Layout content={content} />;

export default Index;
