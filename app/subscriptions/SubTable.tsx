import { Subscription } from './types';
import { SubscriptionFormFields } from '../components/form/FormManifest';
import Form from '../components/form/Form';

interface SubTableProps {
  userSubscriptions: Subscription[];
}

const baseImageURL = 'https://www.themoviedb.org/t/p/w500';

const SubTable: React.FC<SubTableProps> = ({ userSubscriptions }) => {
  return (
    <div>
      {userSubscriptions && (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {userSubscriptions.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-800">
                <td>
                  <div className="flex items-center gap-3">
                    {sub.streamingProvider && (
                      <img
                        src={`${baseImageURL}${sub.streamingProvider?.logoUrl}`}
                        alt={`${sub.streamingProvider.name} logo`}
                        className="w-8 h-8"
                      />
                    )}
                    <div>
                      <div className="font-bold">
                        {sub.streamingProvider!.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td>{sub.description || 'N/A'}</td>
                <td>{sub.cost ? sub.cost.toString() : 'N/A'}</td>

                <td>
                  <Form
                    formTitle="Edit Subscription"
                    openText="Edit"
                    submitText="Save"
                    formFields={SubscriptionFormFields}
                    initialData={sub}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SubTable;
