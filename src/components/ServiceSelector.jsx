function ServiceSelector({
  serviceList,
  myServices,
  setMyServices
}) {
  return (
    <>
      <h2>加入中のサービス</h2>

      <div className="service-list">
        {serviceList.map((service, index) => (
          <label
            key={index}
            className="service-item"
          >
            <input
              type="checkbox"
              checked={
                myServices.some(
                  item => item.name === service.name
                )
              }
              onChange={(e) => {
                if (e.target.checked) {
                  setMyServices([
                    ...myServices,
                    service
                  ]);
                } else {
                  setMyServices(
                    myServices.filter(
                      item =>
                        item.name !== service.name
                    )
                  );
                }
              }}
            />

            <span>{service.name}</span>
          </label>
        ))}
      </div>
    </>
  );
}

export default ServiceSelector;