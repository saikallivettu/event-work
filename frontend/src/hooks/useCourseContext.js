import { useMatch } from 'react-router-dom';

export const useCourseContext = () => {
  const coursePageMatch = useMatch('/courses/:courseId');
  const submissionsPageMatch = useMatch('/assignments/:assignmentId/submissions');

  if (coursePageMatch) return coursePageMatch.params.courseId;
  // Could extend: map assignmentId to courseId via an API call if desired
  return null;
};
