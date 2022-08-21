import { EditIcon } from "@chakra-ui/icons";
import { Box, Flex, Spinner, Td, Text, Tooltip, Tr } from "@chakra-ui/react";
import { useState } from "react";
import { FullSubjectComponent } from "../../../lib/logic/fullEntities";
import { calculateLetterGrade, ProcessedCourseInfo } from "../../../lib/logic/processing";
import { useUserContext } from "../../../lib/UserContext";
import { GkEditable } from "../../generic/GkEditable";

const ComponentRow = (props: {
  component: FullSubjectComponent;
  subject: ProcessedCourseInfo;
  componentGrade: { value: number; isUnknown: boolean; isAverage: boolean };
  onRequestModalOpen: () => void;
}) => {
  const user = useUserContext();
  const e = props.component;
  const subject = props.subject;
  const grade = props.componentGrade;
  const [singularValue, setSingularValue] = useState(
    props.component.subcomponents[0]?.isCompleted ? (grade.value * 100).toFixed(2).toString() + "%" : "0%"
  );
  const [subjectWeighting, setSubjectWeighting] = useState(props.component.subjectWeighting * 100 + "%");
  const [name, setName] = useState(props.component.name);
  const [sectionLoadingUpdate, setSectionLoadingUpdate] = useState("");
  const [touched, setTouched] = useState(false);
  return (
    <Tr key={e.name}>
      <Td pl={0} style={{}}>
        {sectionLoadingUpdate !== "name" ? (
          <>
            <Flex alignItems="center">
              <GkEditable
                value={name}
                onChange={(e) => {
                  setTouched(true);
                  setName(e);
                }}
                inputProps={{
                  size: props.component.name.length,
                }}
                onCancelEdit={(e) => {
                  setTouched(false);
                  setName(props.component.name);
                }}
                displayProps={{ fontWeight: "bold" }}
                onSubmit={async () => {
                  if (touched) {
                    setSectionLoadingUpdate("name");
                    const response = await fetch(
                      `/api/block/${subject.studyBlockId}/course/${subject.id}/component/${props.component.id}`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          name: name,
                        }),
                      }
                    );
                    const data = await response.json();
                    user.updateCourse(props.subject.id, {
                      ...props.subject,
                      components: props.subject.components.map((cc) => {
                        if (cc.id !== props.component.id) return cc;
                        return { ...cc, name: name };
                      }),
                    });
                    setSectionLoadingUpdate("");
                    setTouched(false);
                  }
                }}
              />
              <Text ml={1}>{e.subcomponents?.length > 1 ? <span>({e.subcomponents.length})</span> : ""}</Text>
            </Flex>
          </>
        ) : (
          <>
            {" "}
            <Spinner color={subject.color} size="sm" />
          </>
        )}
      </Td>
      <Td pl={0} className="text-center" style={{}}>
        {sectionLoadingUpdate === "weight" ? (
          <>
            {" "}
            <Spinner color={subject.color} size="sm" />
          </>
        ) : (
          <GkEditable
            onChange={(e) => {
              setSubjectWeighting(e);
              setTouched(true);
            }}
            onBeginEdit={(e) => {
              setSubjectWeighting(e.replaceAll("%", ""));
            }}
            onSubmit={async (e) => {
              setSectionLoadingUpdate("weight");
              const response = await fetch(`/api/block/${subject.studyBlockId}/course/${subject.id}/component/${props.component.id}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  subjectWeighting: parseFloat(e.replaceAll("%", "")) / 100,
                }),
              });
              const data = await response.json();
              // user.updateCourse(props.subject.id, {
              //   ...props.subject,
              //   components: props.subject.components.map((cc) => {
              //     if (cc.id !== props.component.id) return cc;
              //     return { ...cc, subjectWeighting: parseFloat(subjectWeighting.replaceAll("%", "")) / 100 };
              //   }),
              // });
              await user.redownload();
              setSubjectWeighting(parseFloat(e.replaceAll("%", "")) + "%");
              setSectionLoadingUpdate("");
            }}
            inputProps={{ size: 2 }}
            onCancelEdit={() => {
              setSubjectWeighting(props.component.subjectWeighting * 100 + "%");
            }}
            value={subjectWeighting}
          />
        )}
      </Td>
      <Td pl={0} color={"brand"} className={grade.isAverage ? "flex flex-col text-center font-semibold" : "text-center font-semibold"}>
        {sectionLoadingUpdate === "score" ? (
          <>
            <Spinner color={subject.color} size="sm" />
          </>
        ) : (
          <>
            {e.subcomponents?.length === 1 ? (
              <Tooltip label="Click to edit">
                <GkEditable
                  onSubmit={async (e) => {
                    if (touched) {
                      const actualGradeValue = Number.parseFloat(e.replaceAll("%", "")) / 100.0;
                      if (!actualGradeValue) {
                        setTouched(false);
                        setSingularValue(
                          props.component.subcomponents[0]?.isCompleted ? (grade.value * 100).toFixed(2).toString() + "%" : "0%"
                        );
                        return;
                      }
                      setSingularValue(e ? Number.parseFloat(e).toFixed(2).toString() + "%" : "");

                      setSectionLoadingUpdate("score");
                      const response = await fetch(
                        `/api/block/${subject.studyBlockId}/course/${subject.id}/component/${props.component.id}`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            subcomponents: [
                              {
                                ...props.component.subcomponents[0],
                                gradeValuePercentage: !!e ? actualGradeValue : 0,
                                isCompleted: !!e,
                              },
                            ],
                          }),
                        }
                      );
                      const data = await response.json();
                      user.updateCourse(props.subject.id, {
                        ...props.subject,
                        components: props.subject.components.map((cc) => {
                          if (cc.id !== props.component.id) return cc;
                          return data;
                        }),
                      });
                      if (!singularValue) setSingularValue("0%");
                      setSectionLoadingUpdate("");
                      setTouched(false);
                    }
                  }}
                  inputProps={{ size: 6 }}
                  onChange={(f) => {
                    setTouched(true);
                    setSingularValue(f);
                  }}
                  value={singularValue}
                  onBeginEdit={() => {
                    setSingularValue(singularValue.replaceAll("%", ""));
                  }}
                  icon={<EditIcon mr={2} />}
                  onCancelEdit={() => {
                    setSingularValue(
                      props.component.subcomponents[0]?.isCompleted ? (grade.value * 100).toFixed(2).toString() + "%" : "0%"
                    );
                  }}
                />
              </Tooltip>
            ) : (
              <>
                {" "}
                {!grade.isUnknown ? (
                  <>
                    <Box
                      cursor="pointer"
                      className="flex"
                      flexDirection={"column"}
                      onClick={() => {
                        props.onRequestModalOpen();
                      }}
                    >
                      <Flex direction={"column"}>
                        <Flex alignItems={"center"}>
                          <EditIcon mr={2} /> {(grade.value * 100).toFixed(2)}%
                        </Flex>
                        {grade.isAverage ? <span className="text-xs text-gray-600">Average</span> : ""}
                      </Flex>
                    </Box>
                  </>
                ) : (
                  <Box
                    cursor="pointer"
                    className="flex"
                    flexDirection={"column"}
                    onClick={() => {
                      props.onRequestModalOpen();
                    }}
                  >
                    <Flex direction={"column"}>
                      <Flex alignItems={"center"}>
                        <EditIcon mr={2} /> 0%
                      </Flex>
                    </Flex>
                  </Box>
                )}
              </>
            )}
          </>
        )}
      </Td>
      <Td pl={0} style={{}} fontWeight={"semibold"} className="text-center">
        {!grade.isUnknown && calculateLetterGrade(grade.value, user.user?.gradeMap)}
      </Td>
    </Tr>
  );
};
export default ComponentRow;
