import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MessageService, SelectItem, TreeNode } from 'tui-component-library';
import { TuiAppService, TuiUserService } from 'tui-iframe';
import { CommonService } from './../../../common/services/common/common.service';
// 引入发送http请求获取数据的类函数
import { OrganizationService } from './../../../common/services/organization/organization.service';

@Component({
    selector: 'app-organization',
    templateUrl: './organization.component.html',
    styleUrls: ['./organization.component.css', '../../commonStyle/index.scss'],
    providers: [MessageService],
})
export class OrganizationComponent implements OnInit {
    loading: boolean = true;
    init: number = 0;
    constructor(
        private commonService: CommonService,
        private messageService: MessageService,
        private organizationService: OrganizationService,
        private tuiuserservice: TuiUserService,
        private tuiappService: TuiAppService,
        private fb: FormBuilder
    ) {}
    orgform: FormGroup;
    optional: SelectItem[];

    readform: FormGroup;
    /**                     隐藏/显示变量                            */
    // 添加框显示/隐藏
    public principal: string = '';
    public display = false;
    public isShow: boolean;
    public letdisplay = false;
    public deldisable = true;
    public pushdisplay = false;
    // 输入框是否可输入
    public disabled: boolean;
    // 按钮是否隐藏
    public isHidden: boolean;
    // 组织机构树弹出框是否显示
    public isDisplay = false;
    // 组织信息框是否显示
    public orgdisplay = false;
    // 删除信息框是否显示
    public deldisplay = false;
    public inputdisplay = false;
    public adddisplay = false;
    public del1display = false;
    public whichlist;
    public ifdisplay;
    uploadedFiles: any[] = [];
    /**                     组织机构信息变量                         */
    // 分页变量
    public value: any = {};
    public clickIndex;
    // 顶级机构列表
    public listfile: any[] = [];
    // 查看夫组织机构id
    public superid;
    // 要查看机构所在索引
    public index: number;
    // 要查看组织机构的id
    public orgTreeId;

    public selectDel: any[] = [];
    // 组织树结构

    public selectedFiles: TreeNode[] = [];
    public aboutusmore;
    public i;
    public changelabel = {
        label: '',
        id: '',
    };

    // 组织机构信息
    public orglist: any = {
        orgName: '',
        companyPhone: '',
        email: '',
        orgNumber: '',
        orgType: '',
        orgNameTreeSet: '',
        tag: '',
        superOrgId: '',
    };

    public loadShow: boolean = false;

    /**                 处理方法                                                 */

    // 初始化/获取组织顶级机构
    public cols1: any[];
    public cols2: any[];

    ngOnInit() {
        this.principal = this.tuiuserservice.curUser.principal;

        this.cols1 = [
            { field: 'orgNumber', header: '组织编号', width: '7%' },
            { field: 'orgName', header: '组织名称', width: '8%' },
            { field: 'orgType', header: '组织类型', width: '7%' },
            { field: 'email', header: '组织邮箱', width: '11%' },
            {
                field: 'companyPhone',
                header: '组织电话',
                width: '11%',
            },
            {
                field: 'orgNameTreeSet',
                header: '组织全路径',
            },
            {
                field: 'dataSourceFlag',
                header: '数据来源',
                width: '8%',
            },
            // { field: "createTime", header: "创建时间" },
            { field: 'updateTime', header: '修改时间' },
            { field: 'tag', header: '标签', width: '10%' },
        ];
        this.readOrgTree();
        this.getOrganizationList('');
        this.getOrgType();
        this.orgmenu();
        //this.Import();
        this.Source();
        this.orgform = this.fb.group({
            orgNumber: new FormControl('', Validators.maxLength(50)),
            orgName: new FormControl('', {
                validators: [
                    Validators.required,
                    Validators.pattern(/^[A-Za-z0-9\u4e00-\u9fa5]+$/),
                    Validators.maxLength(50),
                ],
            }),
            orgType: new FormControl(''),
            email: new FormControl('', {
                validators: [
                    Validators.pattern(
                        /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
                    ),
                ],
                // updateOn: "blur",
            }),
            companyPhone: new FormControl('', {
                validators: [
                    Validators.pattern(
                        /^(([1][3,5,7,8][0-9]{9})|((([0\+]\d{2,3}-?)?(0\d{2,3})-?)(\d{7,8})(-?(\d{3,}))?))$/
                    ),
                ],
                // updateOn: "blur",
            }),
            tag: new FormControl('', Validators.maxLength(200)),
        });

        this.i = 0;
    }
    get orgNumber() {
        return this.orgform.get('orgNumber');
    }
    get email() {
        return this.orgform.get('email');
    }
    get orgName() {
        return this.orgform.get('orgName');
    }
    get orgtype() {
        return this.orgform.get('orgType');
    }
    get companyPhone() {
        return this.orgform.get('companyPhone');
    }
    get tag() {
        return this.orgform.get('tag');
    }

    public isSelected = false;
    public changeSelect() {
        this.isSelected = !this.isSelected;
    }
    public source: any[] = [{ label: '全部', value: '' }];
    public Source() {
        this.source = [{ label: '全部', value: '' }];
        this.organizationService
            .source('data_source_flag', { page: 0, size: 0 })
            .subscribe((data) => {
                for (let item of data.data.list) {
                    this.source.push({
                        label: item.message,
                        value: item.code,
                    });
                }
            });
    }
    // 获取顶级机构列表
    // 列表展示与搜索的参数
    public searchfile: any = {
        orgName: '',
        orgNumber: '',
        datasourceflag: '',
        size: 10,
        page: 1,
    };
    public first: number = 0;
    public totalnum = 0;
    public idOrgarr: string[] = [];
    public isSearch: boolean;
    public getOrganizationList(a) {
        this.init = 0;
        this.loading = true;
        this.loadShow = true;
        if (a === 1) {
            this.isSearch = true;
            this.searchfile.page = 1;
        }
        // if (a === 2) {
        //   this.searchfile.page = 1;
        // }
        this.organizationService
            .searchOrganization(this.searchfile)
            .subscribe((data) => {
                this.loadShow = false;
                this.first = data.data.startRow - 1;
                this.totalnum = data.data.total;
                let orglist = data.data.list;
                if (orglist.length > 0) {
                    orglist.forEach((item) => {
                        if (item.orgNameTreeSet.length > 0) {
                            item.orgNameTreeSet = item.orgNameTreeSet
                                .reverse()
                                .join('-');
                        } else {
                            item.orgNameTreeSet = '--';
                        }
                    });
                }
                this.init++;
                this.loading = false;
                this.listfile = orglist;
            });
    }
    public paginate(e) {
        this.selectDel = [];
        this.searchfile.page = e.page + 1;
        this.searchfile.size = e.rows;
        if (this.isSearch) {
            this.getOrganizationList(2);
        } else {
            this.getOrganizationList('');
        }
    }
    // 搜索重置
    public orgreset() {
        this.first = 0;

        this.searchfile = {
            orgName: '',
            orgNumber: '',
            datasourceflag: '',
            size: 10,
            page: 1,
        };
        this.isSearch = false;
        this.getOrganizationList('');
    }
    public treeIsDisplay = false;
    public treeDisplay() {
        this.treeIsDisplay = true;
    }
    // 2 查看组织机构树请求
    public orgtree: any[] = [
        {
            orgName: '组织机构',
            expanded: true,
            expandedIcon: 'icon-folder-open2',
            collapsedIcon: 'icon-folder',
            selectable: false,
            children: [],
        },
    ];
    public readOrgTree() {
        this.organizationService.getOrganizationTree().subscribe((data) => {
            this.orgtree[0].children = data.data.list;
            this.isOrgTree(this.orgtree);
        });
    }

    public childrentree: any[] = [];
    public getChildrenTree(id) {
        this.organizationService.getchildrentree(id).subscribe((data) => {
            this.childrentree = data.data;
            this.showorgtree();
        });
    }
    // 3 循环组织
    public isOrgTree(data) {
        data.forEach((ele) => {
            if (this.ccc === 1 && this.childrentree.includes(ele.id)) {
                ele.label = ele.orgName;
                ele.expandedIcon = 'icon-folder-open2';
                ele.collapsedIcon = 'icon-folder';
                ele.selectable = false;
                // ele.expanded = false;
                if (ele.children && ele.children.length > 0) {
                    this.isOrgTree(ele.children);
                }
            } else {
                ele.label = ele.orgName;
                ele.expandedIcon = 'icon-folder-open2';
                ele.collapsedIcon = 'icon-folder';
                if (ele.children && ele.children.length > 0) {
                    this.isOrgTree(ele.children);
                }
            }
        });
    }
    public orgname = '';
    public orgid = '';
    public selectNode(e) {
        this.orgid = e.node.id;
        this.orgname = e.node.label;
        this.treeIsDisplay = false;
    }
    public clearselect(e) {
        e.stopPropagation();
        e.cancelBubble = true;
        this.orgname = '';
        this.orgid = '';
    }
    //public isSelected = false;
    public addIsDisplay = false;
    public showClear() {
        this.isSelected = !this.isSelected;
    }
    public recurrence() {
        this.addIsDisplay = false;
        this.treeIsDisplay = false;
        this.formreset();
    }
    // 添加顶级机构
    // 1 弹出添加框
    public ccc;
    public superorgid;
    public showDialog(a, b) {
        //this.display = true;
        this.addIsDisplay = true;
        this.ccc = b;
        if (b == 1) {
            this.orgTreeId = this.listfile[a].id;
            this.getorglist(this.orgTreeId, '');
        }
        this.showorgtree();
    }
    public formreset() {
        this.orgform.reset();
        //this.orgform.get("orgType").setValue("");
        this.orgname = '';
        this.orgid = '';
        this.orgform.patchValue({
            orgType: '',
        });
        this.treeIsDisplay = false;
    }
    showorgtree() {
        this.readOrgTree();
    }

    public ensure() {
        this.display = false;
    }
    // 2 添加顶级机构
    public orgoneprarms = {
        orgName: '',
        orgId: '',
    };
    public addOrganizationList() {
        this.orgoneprarms = {
            orgName: this.orgform.value.orgName,
            orgId: '',
        };
        // if (this.orgname === this.orgform.value.orgName) {
        //   this.messageService.add({
        //     severity: "error",
        //     summary: "错误",
        //     detail: "不能存在同名父组织",
        //   });
        // } else {
        this.organizationService.orgOne(this.orgoneprarms).subscribe((data) => {
            if (data === 'success') {
                this.organizationService
                    .addorg(this.orgid, this.orgform.value)
                    .subscribe((data) => {
                        if (data.code === 200) {
                            this.isSearch = false;
                            this.getOrganizationList('');
                            this.showInfo();
                            this.showorgtree();
                            this.addIsDisplay = false;
                            this.formreset();
                        }
                    });
            } else {
                this.noOnly();
            }
        });
        this.treeIsDisplay = false;
    }
    // piliangtanchukuang1
    public deletedia() {
        this.del1display = true;
    }
    // optional
    public typeprarms = {
        size: 0,
        page: 0,
    };
    public getOrgType() {
        this.optional = [];
        this.organizationService.orgtype('org_type').subscribe((data) => {
            for (let item of data.data.list) {
                this.optional.push({
                    label: item.message,
                    value: item.message,
                });
            }
        });
    }
    public orgoptional = [];
    public orgmenu() {
        this.organizationService.orgtmeun(this.typeprarms).subscribe((data) => {
            this.orgoptional = [{ label: '', value: 0 }];
            if (data.data.list.length > 0) {
                for (let item of data.data.list) {
                    this.orgoptional.push({
                        label: item.orgName,
                        value: item.id,
                    });
                }
            }
        });
    }
    // JDBC文件导入

    // 组织导入
    public importurl;
    public isfileupload = false;
    public isloading = false;
    public Import() {
        return (this.importurl = this.organizationService.import(
            `principal=${this.principal}`
        ));
    }
    public message = {
        totalRowNumber: '',
        successRowNumber: '',
        errorRowNumber: '',
        errorMsgList: [],
    };

    public fileImport() {
        this.pushdisplay = true;
    }

    load(e) {
        // for (let file of e.files) {
        //   this.uploadedFiles.push(file);
        // }

        if (e.originalEvent.body.code === 200) {
            this.isfileupload = true;
            this.isloading = false;
            this.message = e.originalEvent.body.data;
            this.getOrganizationList('');
        } else {
            this.isloading = false;
            this.messageService.add({
                severity: 'error',
                summary: '错误',
                detail: e.originalEvent.body.message,
            });
        }
    }
    fileSelect(e) {
        if (e.files.length === 0) {
            this.messageService.add({
                severity: 'error',
                summary: '错误',
                detail: '所选文件类型不符合要求，请重新选择！',
            });
        }
    }

    public importhide() {
        this.pushdisplay = false;
        this.isfileupload = false;
    }
    // EXCEL下载
    public fileprarm = {
        templatename: 'org',
    };

    public downLoad() {
        location.href = this.organizationService.download(
            this.fileprarm.templatename,
            `principal=${this.principal}`
        );
    }

    // 查看组织信息
    // 1 查看框弹出
    public showOrgDia(i) {
        this.orgdisplay = true;
        this.index = i;
        this.orgTreeId = this.listfile[i].id;
        this.getorglist(this.orgTreeId, '');
    }
    // 2 获取组织信息
    public abc;
    public getorglist(id, aa) {
        this.organizationService.getOrgList(id, aa).subscribe((data) => {
            this.orglist = data.data;
            if (this.orglist.orgType === null) {
                this.orglist.orgType = '';
            }
            if (this.orglist.orgNameTreeSet[1]) {
                //this.abc =2;
                this.orgname = this.orglist.orgNameTreeSet[1];
            } else {
                // this.abc = 1;
                this.orgname = '';
            }

            this.getChildrenTree(this.orglist.id);

            this.superorgid = this.orglist.superOrgId;
            this.orgform.patchValue(this.orglist);
        });
    }
    // 修改组织信息
    public updateOrgList() {
        this.orgoneprarms = {
            orgName: this.orgform.value.orgName,
            orgId: this.orglist.id,
        };
        if (this.orgname === this.orgform.value.orgName) {
            this.messageService.add({
                severity: 'error',
                summary: '错误',
                detail: '不能存在同名父组织',
            });
        } else {
            this.organizationService
                .orgOne(this.orgoneprarms)
                .subscribe((data) => {
                    if (data === 'success') {
                        let prarms = Object.assign(this.orgform.value, {
                            id: this.orglist.id,
                            superOrgId:
                                this.orgid === ''
                                    ? this.superorgid
                                    : this.orgid,
                        });
                        // if (prarms.id === prarms.superOrgId) {
                        //   this.notupdate();
                        // } else {
                        this.organizationService
                            .updateOrgList(prarms)
                            .subscribe((data) => {
                                this.ccc = '';
                                this.orgid = '';
                                this.readOrgTree();
                                if (this.isSearch) {
                                    this.getOrganizationList(1);
                                } else {
                                    this.getOrganizationList('');
                                }
                                this.updatesuccess();
                                this.addIsDisplay = false;
                            });
                        //}
                    } else {
                        this.noOnly();
                    }
                });
            this.treeIsDisplay = false;
        }
    }
    // 关闭弹出框
    public close() {
        this.orgdisplay = false;
        this.deldisplay = false;
        this.del1display = false;
        this.display = false;

        // this.message = {
        //   totalRowNumber: "",
        //   successRowNumber: "",
        //   errorRowNumber: "",
        //   errorMsgList: [],
        // };
    }

    // 删除组织信息
    // 1 弹出删除框

    public showDelDia(i) {
        this.index = i;
        this.deldisplay = true;
        this.isdeleted = this.listfile[i];
        this.orgTreeId = this.listfile[i].id;
    }

    // 2 删除组织信息
    public deleteitem() {
        this.deleteOrgList(this.orgTreeId, '');
    }
    // 3 删除方法
    public deleteOrgList(id, aa) {
        this.organizationService.deleteList(id, aa).subscribe((data) => {
            if (data.code === 200) {
                if (this.isSearch) {
                    this.getOrganizationList(1);
                } else {
                    this.getOrganizationList('');
                }
                this.deletesuccess();
            }
            if (data.code === 400 || data.code === 500) {
                this.deleteErr(data.message);
            }
            this.deldisplay = false;
        });
        this.readOrgTree();
    }
    // piliangshanchu
    public isdeleted;
    public selectCarWithButton() {
        let prarms = [];
        for (let item of this.selectDel) {
            if (item !== this.isdeleted) {
                prarms.push(item.id);
            }
        }
        let del = {
            ids: prarms.join(','),
        };
        this.organizationService.deleteall(del).subscribe((data) => {
            this.selectDel = [];
            if (data.code === 200) {
                if (this.isSearch) {
                    this.getOrganizationList(1);
                } else {
                    this.getOrganizationList('');
                }

                this.delScuss();
            }
            if (data.code === 400 || data.code === 500) {
                this.deleteErr(data.message);
            }
            this.del1display = false;
            this.readOrgTree();
        });
    }

    public onclick() {}

    showInfo() {
        this.messageService.add({
            severity: 'success',
            summary: '提示',
            detail: '添加成功',
        });
    }

    showScuss() {
        this.messageService.add({
            severity: 'success',
            summary: '提示',
            detail: '导入成功',
        });
    }
    delScuss() {
        this.messageService.add({
            severity: 'success',
            summary: '提示',
            detail: '批量删除成功',
        });
    }
    notupdate() {
        this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: '组织不能选择自身做父组织',
        });
    }
    deleteErr(message) {
        this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: message,
        });
    }
    noOnly() {
        this.messageService.add({
            severity: 'error',
            summary: '错误',
            detail: '组织机构违反唯一性',
        });
    }
    updatesuccess() {
        this.messageService.add({
            severity: 'info',
            summary: '提示',
            detail: '修改成功',
        });
    }
    deletesuccess() {
        this.messageService.add({
            severity: 'info',
            summary: '提示',
            detail: '删除成功',
        });
    }

    // hnyd
    public hnlist: any[];
    public hnsearchprarms = {
        orgname: '',
        orgtypeword: '',
        page: 1,
        size: 10,
    };
    hnList() {
        this.organizationService
            .hnlist(this.hnsearchprarms)
            .subscribe((data) => {
                this.first = data.data.startRow - 1;
                this.totalnum = data.data.total;
                this.hnsearchprarms.page = 1;
                this.hnlist = data.data.list;
            });
    }

    public hndetail = {
        orgNumber: '',
        orgName: '',
        orgType: '',
        createUserName: '',
        createTime: '',
    };
    hnDetail(i) {
        this.orgdisplay = true;
        this.hndetail = i;
    }

    //判断提示是否显示
    // isLength(item) {
    //   const a = document.body.scrollWidth * 0.987 - 46;
    //   return 111;
    // }
}
