import { Compiler, CompilerFactory } from '@angular/core';

export function createCompiler(compilerFactory: CompilerFactory): Compiler {
    return compilerFactory.createCompiler();
}
