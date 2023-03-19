import useMakeOrders from "../../hooks/useMakeOrders";

const CreateOrder = ({ selectedSymbol, orderType, amount }) => {
  const { createLongOrder, createShortOrder } = useMakeOrders();

  // Event handles
  const handleLongClick = () => createLongOrder(selectedSymbol, orderType, amount);
  const handleShortClick = () => createShortOrder(selectedSymbol, orderType, amount);

  return (
    <>
      <div className="buttons">
        <button className="long" onClick={handleLongClick}>
          Long
        </button>
        <button className="short" onClick={handleShortClick}>
          Short
        </button>
      </div>
    </>
  );
};

export default CreateOrder;
