type Text = { en: string; zh: string };
type Story = { title: Text; intro: Text; sections: { heading: Text; body: Text }[] };
export const stories: Record<string, Record<string, Story>> = {
  insights: {
    "delivery-system": { title: { en: "How to choose the right vending delivery system", zh: "如何选择合适的自动售货机出货系统" }, intro: { en: "Start with the product, its packaging and the customer's pickup experience, not the cabinet alone.", zh: "先考虑商品、包装和消费者取货体验，而不是只看机柜外观。" }, sections: [
      { heading: { en: "Match delivery to product risk", zh: "根据商品风险选择出货方式" }, body: { en: "Package strength, weight, shape and permitted drop distance all affect the choice. Test the actual assortment, including the smallest and largest packages, before approving a channel layout.", zh: "包装强度、重量、形状和允许跌落距离都会影响选型。确认货道布局前，应使用真实商品测试，覆盖最小和最大的包装。" } },
      { heading: { en: "Review the complete journey", zh: "检查完整出货流程" }, body: { en: "Check loading, selection, product movement and customer retrieval. Evaluate where a package can catch, tilt or fall, and how an operator can recover from a failed delivery.", zh: "检查补货、选购、商品移动和取货环节，评估包装卡住、倾斜或掉落的位置，以及出货失败后的恢复方式。" } },
      { heading: { en: "Balance protection and capacity", zh: "平衡商品保护与容量" }, body: { en: "An elevator can support controlled handling, but the mechanism also uses cabinet space and needs maintenance access. Compare usable capacity, cycle time and service requirements using a working sample.", zh: "升降机构有助于控制商品移动，但也占用机柜空间，并需要维护通道。应通过样机比较实际容量、出货时间和维护要求。" } },
    ] },
    "custom-machine-checklist": { title: { en: "Seven questions before ordering a custom machine", zh: "定制自动售货机前的七个问题" }, intro: { en: "A complete brief helps the engineering team review feasibility and quote the right configuration.", zh: "完整的需求说明有助于工程团队评估可行性，并为合适的配置报价。" }, sections: [
      { heading: { en: "1. What will you sell?", zh: "1. 销售什么商品？" }, body: { en: "List product sizes, weights, packaging variations and any fragile items. Supply physical samples for validation.", zh: "列出商品尺寸、重量、包装差异及易碎商品，并提供实物样品进行验证。" } },
      { heading: { en: "2. Where will it operate?", zh: "2. 安装在哪里？" }, body: { en: "Define indoor or outdoor placement, available space, access routes, ambient conditions and power supply.", zh: "明确室内或室外场景、可用空间、搬运通道、环境条件和电源。" } },
      { heading: { en: "3. Which payment methods?", zh: "3. 使用哪些支付方式？" }, body: { en: "Specify the destination market and proposed payment provider. Confirm terminal availability and integration requirements.", zh: "指定目标市场和计划使用的支付服务商，确认终端供应和系统对接要求。" } },
      { heading: { en: "4. What needs customization?", zh: "4. 需要定制什么？" }, body: { en: "Separate branding changes from mechanical or software development: each affects cost, validation and timing differently.", zh: "将品牌外观修改与机械、软件开发分别列明，它们对成本、验证和时间的影响不同。" } },
      { heading: { en: "5. How will you refill and maintain it?", zh: "5. 如何补货和维护？" }, body: { en: "Describe refill frequency, local technician support, spare parts and the remote information operators need.", zh: "说明补货频率、当地技术支持、备件和运营人员需要的远程信息。" } },
      { heading: { en: "6. What is the rollout plan?", zh: "6. 如何部署？" }, body: { en: "Agree an initial sample or pilot, expected quantities and approval milestones before setting a volume-delivery target.", zh: "确定样机或试点、预计数量和验收节点，再确认批量交付目标。" } },
      { heading: { en: "7. What must be approved?", zh: "7. 需要确认哪些事项？" }, body: { en: "Confirm drawings, test criteria, destination-market requirements, packing and shipping responsibilities in the written order.", zh: "在书面订单中明确图纸、测试标准、目标市场要求、包装和运输责任。" } },
    ] },
    "serviceable-design": { title: { en: "Designing a vending machine that is easier to service", zh: "如何让自动售货机更便于维护" }, intro: { en: "Service access and clear diagnostics deserve attention before production, not after a fault occurs.", zh: "维护空间和清晰诊断应在生产前考虑，而不是等故障出现后再解决。" }, sections: [
      { heading: { en: "Use accessible modules", zh: "采用易于接近的模块" }, body: { en: "Identify the components most likely to need inspection or replacement. Check door clearance, cable access and safe isolation procedures in the installed position.", zh: "识别最可能需要检查或更换的组件，检查安装状态下的开门空间、线缆通道和安全断电流程。" } },
      { heading: { en: "Make diagnostics useful", zh: "让诊断信息真正有用" }, body: { en: "Operators need actionable information: the affected subsystem, relevant event history and a clear next check. Agree what data is available remotely.", zh: "运营人员需要可采取行动的信息，包括受影响的系统、相关事件记录和下一步检查建议。应确认哪些数据可以远程查看。" } },
      { heading: { en: "Prepare the service handover", zh: "准备维护交接" }, body: { en: "Request a parts list, labelled wiring documentation, operating instructions and training. Plan spare parts around your fleet size and local support arrangements.", zh: "准备备件清单、线缆标识资料、操作说明和培训，并根据设备规模和当地支持条件安排备件。" } },
    ] },
  },
  projects: {
    "beauty-retail": { title: { en: "A compact 24/7 beauty storefront", zh: "紧凑型全天候美妆零售空间" }, intro: { en: "Application concept: a branded vending experience for small beauty products. This is not a verified customer deployment.", zh: "应用方案示例：为小型美妆产品打造品牌化售卖体验，并非已核实的客户交付案例。" }, sections: [
      { heading: { en: "The requirement", zh: "需求" }, body: { en: "Present small products clearly and make selection, payment and pickup easy in a limited footprint.", zh: "在有限空间内清晰展示小商品，让选购、支付与取货更便捷。" } },
      { heading: { en: "The proposed configuration", zh: "建议配置" }, body: { en: "An illuminated display, product-specific channels, touchscreen selection and market-compatible payments form the starting point.", zh: "以灯光展示、适配货道、触屏选购和目标市场支付方式作为方案起点。" } },
      { heading: { en: "What to validate", zh: "验证重点" }, body: { en: "Test packaging through the complete delivery cycle. Confirm refill access, the product menu and the operator's support workflow before rollout.", zh: "测试包装在完整出货流程中的表现，部署前确认补货空间、商品菜单和运营支持流程。" } },
    ] },
    "cold-drink-network": { title: { en: "A cold-drink platform built to scale", zh: "可扩展的冷饮运营平台" }, intro: { en: "Application concept: coordinated cooling, stock visibility and maintenance across multiple locations. Customer results are not yet published.", zh: "应用方案示例：协调多点位温控、库存信息与维护；暂未发布客户实测结果。" }, sections: [
      { heading: { en: "The requirement", zh: "需求" }, body: { en: "Support a repeatable beverage assortment while giving operators visibility into stock and machine status.", zh: "支持可复制的饮品组合，并让运营人员了解库存和设备状态。" } },
      { heading: { en: "The proposed configuration", zh: "建议配置" }, body: { en: "Refrigerated storage, configurable channels, telemetry and modular service access support the operating plan.", zh: "以冷藏储存、可配置货道、远程监控和模块化维护支持运营计划。" } },
      { heading: { en: "What to validate", zh: "验证重点" }, body: { en: "Confirm ambient conditions, temperature requirements, refill routes and connectivity through a pilot before expanding the fleet.", zh: "扩大设备规模前，通过试点确认环境条件、温控要求、补货路线和联网条件。" } },
    ] },
    "office-smart-store": { title: { en: "Office smart store vending in the United States", zh: "美国办公室智能零售点" }, intro: { en: "Overseas application scenario for office snacks, cold drinks and workplace convenience vending.", zh: "面向海外办公室零食、冷饮和办公便利零售的应用场景。" }, sections: [
      { heading: { en: "Scene", zh: "场景" }, body: { en: "Office buildings need compact unattended retail near pantry areas, meeting rooms and shared floors. BOHOL machines can be configured for chilled drinks, snacks and cashless payment.", zh: "办公楼需要在茶水间、会议室和共享楼层附近配置紧凑型无人零售。BOHOL 可配置冷饮、零食和无现金支付。" } },
      { heading: { en: "SEO keywords", zh: "SEO 关键词" }, body: { en: "office vending machine, workplace micro market, smart vending machine USA, snack and drink vending supplier, custom vending machine manufacturer.", zh: "办公室自动售货机、办公微型便利店、美国智能售货机、零食饮料售货机供应商、定制售货机厂家。" } },
    ] },
    "apartment-lobby-vending": { title: { en: "Apartment lobby vending in Canada", zh: "加拿大公寓大堂售货方案" }, intro: { en: "A residential vending scenario for condos, apartments and student housing.", zh: "适合公寓、住宅楼和学生公寓的无人零售场景。" }, sections: [
      { heading: { en: "Scene", zh: "场景" }, body: { en: "Residents want daily convenience after nearby stores close. A lobby vending setup can sell beverages, snacks and small essentials with a clean cabinet finish.", zh: "住户在周边商店关闭后仍需要便利购物。大堂售货方案可销售饮料、零食和小型日用品，并保持整洁外观。" } },
      { heading: { en: "SEO keywords", zh: "SEO 关键词" }, body: { en: "apartment vending machine, condo vending solution, residential smart store Canada, 24 hour lobby vending, unattended convenience retail.", zh: "公寓自动售货机、住宅售货方案、加拿大智能零售、24小时大堂售货、无人便利零售。" } },
    ] },
    "hotel-lobby-vending": { title: { en: "Hotel lobby vending in Europe", zh: "欧洲酒店大堂售货方案" }, intro: { en: "A guest-convenience format for hotels, serviced apartments and travel properties.", zh: "面向酒店、服务式公寓和旅行住宿场景的便利零售方案。" }, sections: [
      { heading: { en: "Scene", zh: "场景" }, body: { en: "Hotels can add a self-service retail point for late-night drinks, travel essentials and premium packaged products without operating a staffed shop.", zh: "酒店可增加自助零售点，为夜间宾客提供冷饮、旅行用品和高端包装商品，而无需开设人工门店。" } },
      { heading: { en: "SEO keywords", zh: "SEO 关键词" }, body: { en: "hotel vending machine, lobby vending solution Europe, travel essentials vending, custom vending machine for hotels, smart retail cabinet.", zh: "酒店自动售货机、欧洲大堂售货方案、旅行用品售货机、酒店定制售货机、智能零售柜。" } },
    ] },
    "gym-vending": { title: { en: "Gym vending machine solution in the UAE", zh: "阿联酋健身房售货方案" }, intro: { en: "A fitness retail scenario for protein drinks, energy snacks and wellness products.", zh: "面向蛋白饮料、能量零食和健康产品的健身零售场景。" }, sections: [
      { heading: { en: "Scene", zh: "场景" }, body: { en: "Fitness clubs need fast self-service retail before and after training. Refrigerated vending can support sports drinks, protein products and accessories.", zh: "健身俱乐部需要在训练前后提供快速自助购买。冷藏售货机可支持运动饮料、蛋白产品和健身配件。" } },
      { heading: { en: "SEO keywords", zh: "SEO 关键词" }, body: { en: "gym vending machine UAE, fitness vending solution, protein drink vending machine, cashless vending for gyms, sports nutrition vending.", zh: "阿联酋健身房售货机、健身零售方案、蛋白饮料售货机、健身房无现金售货、运动营养售货机。" } },
    ] },
    "hospital-vending": { title: { en: "Hospital vending for staff and visitors in Singapore", zh: "新加坡医院员工与访客售货方案" }, intro: { en: "A healthcare facility vending scenario for reliable indoor access.", zh: "面向医疗机构室内便利购买的售货场景。" }, sections: [
      { heading: { en: "Scene", zh: "场景" }, body: { en: "Hospitals and clinics often need unattended access to drinks, snacks and essentials for visitors and staff outside normal shop hours.", zh: "医院和诊所常需要在普通商店营业时间外，为访客和员工提供饮料、零食和必需品。" } },
      { heading: { en: "SEO keywords", zh: "SEO 关键词" }, body: { en: "hospital vending machine Singapore, healthcare vending solution, visitor vending, staff snack vending, reliable unattended retail.", zh: "新加坡医院自动售货机、医疗机构售货方案、访客售货机、员工零食售货机、稳定无人零售。" } },
    ] },
    "school-campus-vending": { title: { en: "School and campus vending in Australia", zh: "澳大利亚校园售货方案" }, intro: { en: "A campus vending scenario for controlled product access and simple service routes.", zh: "面向校园可控售卖和便捷维护路线的应用场景。" }, sections: [
      { heading: { en: "Scene", zh: "场景" }, body: { en: "Schools and campuses can place vending in student centers, residence halls and staff areas, with product menus selected around local policies.", zh: "学校和校园可在学生中心、宿舍和员工区放置售货设备，并根据当地政策选择商品菜单。" } },
      { heading: { en: "SEO keywords", zh: "SEO 关键词" }, body: { en: "school vending machine Australia, campus vending solution, university smart vending, student snack machine, controlled access vending.", zh: "澳大利亚学校售货机、校园售货方案、大学智能售货、学生零食售货机、可控售货机。" } },
    ] },
    "public-building-vending": { title: { en: "Public building vending in Germany", zh: "德国公共建筑售货方案" }, intro: { en: "A public-facility vending scenario for waiting areas and municipal buildings.", zh: "适合公共等候区和市政建筑的无人零售场景。" }, sections: [
      { heading: { en: "Scene", zh: "场景" }, body: { en: "Public facilities need durable cabinets, simple service access and reliable payment options for visitors in waiting areas.", zh: "公共设施需要耐用机柜、便捷维护空间和可靠支付方式，服务等候区访客。" } },
      { heading: { en: "SEO keywords", zh: "SEO 关键词" }, body: { en: "public building vending Germany, municipal vending machine, waiting area vending, durable vending cabinet, European vending supplier.", zh: "德国公共建筑售货机、市政售货机、等候区售货、耐用售货机柜、欧洲售货机供应商。" } },
    ] },
    "commercial-breakroom-vending": { title: { en: "Commercial breakroom vending in the UK", zh: "英国商业楼休息区零售" }, intro: { en: "A breakroom vending setup for offices, coworking spaces and commercial properties.", zh: "适合办公室、共享办公和商业物业休息区的售货方案。" }, sections: [
      { heading: { en: "Scene", zh: "场景" }, body: { en: "Commercial buildings can offer a convenient snack and drink point while keeping operator access simple for restocking and service.", zh: "商业楼可提供便利的零食饮料点位，同时保持运营方补货和维护通道简单。" } },
      { heading: { en: "SEO keywords", zh: "SEO 关键词" }, body: { en: "breakroom vending UK, office snack vending machine, commercial vending solution, smart vending for workplaces, custom vending supplier.", zh: "英国休息区售货机、办公室零食售货机、商业售货方案、办公智能售货、定制售货机供应商。" } },
    ] },
    "residential-tower-vending": { title: { en: "Residential tower vending in Australia", zh: "澳大利亚住宅塔楼售货方案" }, intro: { en: "A premium lobby vending scenario where cabinet appearance matters.", zh: "机柜外观与室内空间匹配的高端住宅大堂售货场景。" }, sections: [
      { heading: { en: "Scene", zh: "场景" }, body: { en: "Premium residential buildings can use branded cabinet finishes and clean product presentation to match lobby interiors.", zh: "高端住宅楼可使用品牌化机柜外观和整洁商品陈列，匹配大堂室内设计。" } },
      { heading: { en: "SEO keywords", zh: "SEO 关键词" }, body: { en: "residential tower vending Australia, premium lobby vending, apartment smart store, custom cabinet vending, luxury property vending.", zh: "澳大利亚住宅塔楼售货机、高端大堂售货、公寓智能零售、定制机柜售货、高端物业售货。" } },
    ] },
    "dessert-bakery-vending": { title: { en: "Dessert and bakery vending in France", zh: "法国甜品烘焙售货方案" }, intro: { en: "A specialty-food vending scenario for packaged desserts and premium products.", zh: "适合包装甜品、烘焙食品和高端商品的自动售货场景。" }, sections: [
      { heading: { en: "Scene", zh: "场景" }, body: { en: "Dessert brands and bakery operators can use clear display, controlled delivery and attractive interface design for premium packaged items.", zh: "甜品品牌和烘焙运营商可通过清晰展示、可控出货和美观界面销售高端包装商品。" } },
      { heading: { en: "SEO keywords", zh: "SEO 关键词" }, body: { en: "dessert vending machine France, bakery vending solution, refrigerated food vending, premium food vending cabinet, elevator vending machine.", zh: "法国甜品售货机、烘焙售货方案、冷藏食品售货机、高端食品售货柜、升降售货机。" } },
    ] },
    "customer-pickup-vending": { title: { en: "Retail pickup vending in the United States", zh: "美国零售取货点" }, intro: { en: "A customer-facing vending scenario for direct product selection and cashless checkout.", zh: "面向消费者直接选购和无现金支付的无人零售场景。" }, sections: [
      { heading: { en: "Scene", zh: "场景" }, body: { en: "Retail operators can place vending where customers already pass, using visible product display, touchscreen selection and remote stock checks.", zh: "零售运营商可在客流经过位置部署售货机，通过可视化陈列、触屏选择和远程库存管理提升便利性。" } },
      { heading: { en: "SEO keywords", zh: "SEO 关键词" }, body: { en: "retail vending machine USA, customer pickup vending, cashless smart vending, unattended retail solution, vending machine manufacturer China.", zh: "美国零售售货机、客户自助取货售货、无现金智能售货、无人零售方案、中国售货机制造商。" } },
    ] },
    "distributor-showroom-vending": { title: { en: "Distributor showroom vending display", zh: "经销商展厅售货机展示" }, intro: { en: "A showroom scenario for distributors presenting vending configurations to local buyers.", zh: "适合经销商向本地买家展示自动售货配置的展厅场景。" }, sections: [
      { heading: { en: "Scene", zh: "场景" }, body: { en: "Distributors can demonstrate cabinet formats, product assortments, payment terminals and service access to local operators before orders.", zh: "经销商可在下单前向本地运营商展示机柜形式、商品组合、支付终端和维护通道。" } },
      { heading: { en: "SEO keywords", zh: "SEO 关键词" }, body: { en: "vending machine distributor, OEM vending machine China, vending showroom, custom vending cabinet, overseas vending partnership.", zh: "自动售货机经销商、中国 OEM 售货机、售货机展厅、定制售货机柜、海外售货机合作。" } },
    ] },
  },
};
