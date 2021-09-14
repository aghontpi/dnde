import { useEffect } from "react";
import { useEditor } from "../../Hooks/Editor.hook";
import mjml2html from "mjml-browser";
import css from "./Editor.module.scss";
import { findElementInJson } from "../../Utils/findElementInMjmlJson";
import _ from "lodash";
import Scrollbars from "react-custom-scrollbars-2";
import { htmlProcessor } from "../../Utils/htmlProcessor";
import { Editor } from "../../Components/Mods/Editor";

interface ViewProps {}

export const View = (props: ViewProps) => {
  const { mjmlJson, setMjmlJson, setAttributes, setActive, mjmlstring, setMjmlString } = useEditor();

  useEffect(() => {
    setMjmlString(JSON.stringify(mjmlJson, null, 2));
  }, []);

  useEffect(() => {
    console.log("update trigger", mjmlJson);
  }, [mjmlstring]);

  const onDrop = (e: any) => {
    e.preventDefault();
    const config = JSON.parse(e.dataTransfer.getData("config"));

    const closest = e.target.closest(".mjml-tag");
    let uniqueClassName = "";
    if (!closest) {
      console.error("unable to find closest");
      return;
    }
    for (var i = 0; i < closest.classList.length; i++) {
      const current: string = closest.classList[i];
      if (current.includes("identifier-mj")) {
        uniqueClassName = current;
        break;
      }
    }

    if (uniqueClassName === "") {
      console.error("can not find unique className to proceed further");
      return;
    }
    console.log("closest", closest);
    console.log("uniqueclassName", uniqueClassName);

    let result = findElementInJson(mjmlJson, uniqueClassName);

    if (!result) {
      return;
    }
    let [item, path] = result;

    console.log("item", item, "path", path);

    item.children.push(config);

    setActive({ value: item, path: path + `.children[${item.children.length - 1}]` });

    console.log("added child", item);

    const updated = _.set(mjmlJson, path.slice(1), item);
    setMjmlJson((prev: any) => updated);

    setMjmlString(JSON.stringify(updated, null, 2));

    setAttributes(config.mutalbePropertiesWithDefaultValues);
  };

  return (
    <Scrollbars style={{ height: "100%" }}>
      <Editor />
      <div
        className={`${css.viewHolder} mjml-wrapper mjml-tag identifier-mj-body`}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        {mjmlstring && htmlProcessor(mjml2html(mjmlJson, { minify: true }).html)}
      </div>
    </Scrollbars>
  );
};

const onDragOver = (e: any) => {
  e.preventDefault();
};
