import AlignCenterOutlined from "@ant-design/icons/lib/icons/AlignCenterOutlined";
import AlignLeftOutlined from "@ant-design/icons/lib/icons/AlignLeftOutlined";
import AlignRightOutlined from "@ant-design/icons/lib/icons/AlignRightOutlined";
import PicCenterOutlined from "@ant-design/icons/lib/icons/PicCenterOutlined";
import { Button, Col, Form, Row, Tooltip } from "antd";
import _ from "lodash";
import { useVisibility } from "../../Hooks/Attribute.hook";
import { useEditor } from "../../Hooks/Editor.hook";
import { useHtmlWrapper } from "../../Hooks/Htmlwrapper.hook";

const ATTRIBUTE = "align";

export interface alignOptions {
    title: string;
    prop: string;
    component: any;
}

export const Align = () => {
    const [visible, path] = useVisibility({ attribute: ATTRIBUTE });
    const { mjmlJson, setMjmlJson } = useEditor();
    const { active } = useHtmlWrapper();

    const onClick = (align: string) => {
        if (active && visible && path) {
            let item = _.get(mjmlJson, path);
            if (item && item.attributes && item.attributes) {
                item.attributes["align"] = align;
                const updated = _.set(mjmlJson, path, item);
                setMjmlJson({ ...updated });
            }
        }
    };

    const alignOptions: alignOptions[] = [
        { title: "Left", prop: "left", component: <AlignLeftOutlined /> },
        { title: "Justify", prop: "justify", component: <PicCenterOutlined /> },
        { title: "Center", prop: "center", component: <AlignCenterOutlined /> },
        { title: "Right", prop: "right", component: <AlignRightOutlined /> }
    ];

    return visible ? (
        <Row>
            <Col flex="3">
                <Form.Item label="Align"></Form.Item>
            </Col>
            <Col flex="2">
                <Row justify="space-between">
                    {alignOptions.map((option, key) => {
                        return (
                            <Col key={key}>
                                <Tooltip title={option.title}>
                                    <Button onClick={() => onClick(option.prop)} type="ghost" icon={option.component} />
                                </Tooltip>
                            </Col>
                        );
                    })}
                </Row>
            </Col>
        </Row>
    ) : null;
};
