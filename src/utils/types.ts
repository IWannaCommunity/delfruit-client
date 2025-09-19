import { ReportTypeEnum } from "delfruit-swagger-cg-sdk";

export type Filters = {
	type: ReportTypeEnum | "all";
	answered: boolean | null;
	order: "ASC" | "DESC";
};