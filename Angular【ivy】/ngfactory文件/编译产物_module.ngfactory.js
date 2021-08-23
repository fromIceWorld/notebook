(function anonymous(
  jit_createNgModuleFactory_0,
  jit_AppModule_1,
  jit_AppComponent_2,
  jit_moduleDef_3,
  jit_moduleProvideDef_4,
  jit_ComponentFactoryResolver_5,
  jit_CodegenComponentFactoryResolver_6,
  jit__object_Object__7,
  jit_NgModuleRef_8,
  jit_InjectionToken_LocaleId_9,
  jit__localeFactory_10,
  jit_NgLocalization_11,
  jit_NgLocaleLocalization_12,
  jit_InjectionToken_UseV4Plurals_13,
  jit_Compiler_14,
  jit__object_Object__15,
  jit_InjectionToken_AppId_16,
  jit__appIdRandomProviderFactory_17,
  jit_IterableDiffers_18,
  jit__iterableDiffersFactory_19,
  jit_KeyValueDiffers_20,
  jit__keyValueDiffersFactory_21,
  jit_DomSanitizer_22,
  jit_DomSanitizerImpl_23,
  jit_InjectionToken_DocumentToken_24,
  jit_Sanitizer_25,
  jit_InjectionToken_HammerGestureConfig_26,
  jit_HammerGestureConfig_27,
  jit_InjectionToken_EventManagerPlugins_28,
  jit_DomEventsPlugin_29,
  jit_KeyEventsPlugin_30,
  jit_HammerGesturesPlugin_31,
  jit_NgZone_32,
  jit_InjectionToken_Platform_ID_33,
  jit_Console_34,
  jit_InjectionToken_HammerLoader_35,
  jit_EventManager_36,
  jit_DomSharedStylesHost_37,
  jit_DomRendererFactory2_38,
  jit_RendererFactory2_39,
  jit_SharedStylesHost_40,
  jit_Testability_41,
  jit_CommonModule_42,
  jit_ErrorHandler_43,
  jit_errorHandler_44,
  jit_InjectionToken_Application_Initializer_45,
  jit__createNgProbe_46,
  jit_NgProbeToken_47,
  jit_ApplicationInitStatus_48,
  jit_ApplicationRef_49,
  jit_Injector_50,
  jit_ApplicationModule_51,
  jit_BrowserModule_52,
  jit_InjectionToken_The_presence_of_this_token_marks_an_injector_as_being_the_root_injector__53
) {
  var AppModuleNgFactory = jit_createNgModuleFactory_0(
    jit_AppModule_1,
    [jit_AppComponent_2],
    function(_l) {
      return jit_moduleDef_3([
        jit_moduleProvideDef_4(
          512,
          jit_ComponentFactoryResolver_5,
          jit_CodegenComponentFactoryResolver_6,
          [
            [8, [jit__object_Object__7]],
            [3, jit_ComponentFactoryResolver_5],
            jit_NgModuleRef_8
          ]
        ),
        jit_moduleProvideDef_4(
          5120,
          jit_InjectionToken_LocaleId_9,
          jit__localeFactory_10,
          [[3, jit_InjectionToken_LocaleId_9]]
        ),
        jit_moduleProvideDef_4(
          4608,
          jit_NgLocalization_11,
          jit_NgLocaleLocalization_12,
          [
            jit_InjectionToken_LocaleId_9,
            [2, jit_InjectionToken_UseV4Plurals_13]
          ]
        ),
        jit_moduleProvideDef_4(
          4352,
          jit_Compiler_14,
          jit__object_Object__15,
          []
        ),
        jit_moduleProvideDef_4(
          5120,
          jit_InjectionToken_AppId_16,
          jit__appIdRandomProviderFactory_17,
          []
        ),
        jit_moduleProvideDef_4(
          5120,
          jit_IterableDiffers_18,
          jit__iterableDiffersFactory_19,
          []
        ),
        jit_moduleProvideDef_4(
          5120,
          jit_KeyValueDiffers_20,
          jit__keyValueDiffersFactory_21,
          []
        ),
        jit_moduleProvideDef_4(
          4608,
          jit_DomSanitizer_22,
          jit_DomSanitizerImpl_23,
          [jit_InjectionToken_DocumentToken_24]
        ),
        jit_moduleProvideDef_4(6144, jit_Sanitizer_25, null, [
          jit_DomSanitizer_22
        ]),
        jit_moduleProvideDef_4(
          4608,
          jit_InjectionToken_HammerGestureConfig_26,
          jit_HammerGestureConfig_27,
          []
        ),
        jit_moduleProvideDef_4(
          5120,
          jit_InjectionToken_EventManagerPlugins_28,
          function(p0_0, p0_1, p0_2, p1_0, p2_0, p2_1, p2_2, p2_3) {
            return [
              new jit_DomEventsPlugin_29(p0_0, p0_1, p0_2),
              new jit_KeyEventsPlugin_30(p1_0),
              new jit_HammerGesturesPlugin_31(p2_0, p2_1, p2_2, p2_3)
            ];
          },
          [
            jit_InjectionToken_DocumentToken_24,
            jit_NgZone_32,
            jit_InjectionToken_Platform_ID_33,
            jit_InjectionToken_DocumentToken_24,
            jit_InjectionToken_DocumentToken_24,
            jit_InjectionToken_HammerGestureConfig_26,
            jit_Console_34,
            [2, jit_InjectionToken_HammerLoader_35]
          ]
        ),
        jit_moduleProvideDef_4(4608, jit_EventManager_36, jit_EventManager_36, [
          jit_InjectionToken_EventManagerPlugins_28,
          jit_NgZone_32
        ]),
        jit_moduleProvideDef_4(
          135680,
          jit_DomSharedStylesHost_37,
          jit_DomSharedStylesHost_37,
          [jit_InjectionToken_DocumentToken_24]
        ),
        jit_moduleProvideDef_4(
          4608,
          jit_DomRendererFactory2_38,
          jit_DomRendererFactory2_38,
          [jit_EventManager_36, jit_DomSharedStylesHost_37]
        ),
        jit_moduleProvideDef_4(6144, jit_RendererFactory2_39, null, [
          jit_DomRendererFactory2_38
        ]),
        jit_moduleProvideDef_4(6144, jit_SharedStylesHost_40, null, [
          jit_DomSharedStylesHost_37
        ]),
        jit_moduleProvideDef_4(4608, jit_Testability_41, jit_Testability_41, [
          jit_NgZone_32
        ]),
        jit_moduleProvideDef_4(
          1073742336,
          jit_CommonModule_42,
          jit_CommonModule_42,
          []
        ),
        jit_moduleProvideDef_4(
          1024,
          jit_ErrorHandler_43,
          jit_errorHandler_44,
          []
        ),
        jit_moduleProvideDef_4(
          1024,
          jit_InjectionToken_Application_Initializer_45,
          function(p0_0) {
            return [jit__createNgProbe_46(p0_0)];
          },
          [[2, jit_NgProbeToken_47]]
        ),
        jit_moduleProvideDef_4(
          512,
          jit_ApplicationInitStatus_48,
          jit_ApplicationInitStatus_48,
          [[2, jit_InjectionToken_Application_Initializer_45]]
        ),
        jit_moduleProvideDef_4(
          131584,
          jit_ApplicationRef_49,
          jit_ApplicationRef_49,
          [
            jit_NgZone_32,
            jit_Console_34,
            jit_Injector_50,
            jit_ErrorHandler_43,
            jit_ComponentFactoryResolver_5,
            jit_ApplicationInitStatus_48
          ]
        ),
        jit_moduleProvideDef_4(
          1073742336,
          jit_ApplicationModule_51,
          jit_ApplicationModule_51,
          [jit_ApplicationRef_49]
        ),
        jit_moduleProvideDef_4(
          1073742336,
          jit_BrowserModule_52,
          jit_BrowserModule_52,
          [[3, jit_BrowserModule_52]]
        ),
        jit_moduleProvideDef_4(
          1073742336,
          jit_AppModule_1,
          jit_AppModule_1,
          []
        ),
        jit_moduleProvideDef_4(
          256,
          jit_InjectionToken_The_presence_of_this_token_marks_an_injector_as_being_the_root_injector__53,
          true,
          []
        )
      ]);
    }
  );
  return { AppModuleNgFactory: AppModuleNgFactory };
  //# sourceURL=ng:///AppModule/module.ngfactory.js
  //# sourceMappingURL=data:application/json;base64,eyJmaWxlIjoibmc6Ly8vQXBwTW9kdWxlL21vZHVsZS5uZ2ZhY3RvcnkuanMiLCJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuZzovLy9BcHBNb2R1bGUvbW9kdWxlLm5nZmFjdG9yeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIgIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7In0=
});
