const TutorCard = ({ tutorObject }) => {
  console.log(tutorObject);

  return (
    <div className="tutor-card">
      <img className="tutor-card__avatar" src={tutorObject.photoPath} />{" "}
      <div className="tutor-card__add-info">
        <p className="tutor-card__name">
          {tutorObject.firstName} {tutorObject.patrName}
        </p>
        <p className="tutor-card__subject"> {tutorObject.subject} </p> <p className="tutor-card__price"> от {tutorObject.minPricePerHour} р </p>
      </div>
    </div>
  );
};

export default TutorCard;
