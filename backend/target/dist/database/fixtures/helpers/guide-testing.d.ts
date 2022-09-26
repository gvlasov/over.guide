import { ModuleRef } from "@nestjs/core";
declare type ReturnFunction = (moduleRef: ModuleRef) => void;
export default function createGuideTestingFixture(size: number): ReturnFunction;
export {};
