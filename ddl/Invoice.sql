create external table `Workwave.Invoice2`(
    `InvoiceID` int64,
    `LocationID` int64,
    `BillToID` int64,
    `SetupID` int64,
    `InvoiceNumber` string,
    `OrderNumber` string,
    `Branch` string,
    `BranchID` int64,
    `ServiceLocation` struct<
        `Company` string,
        `LName` string,
        `FName` string,
        `Title` string,
        `Address` string,
        `Address2` string,
        `City` string,
        `State` string,
        `Zip` string
    >,
    `BillTo` struct <
        `Company` string,
        `LName` string,
        `FName` string,
        `Title` string,
        `Address` string,
        `Address2` string,
        `City` string,
        `State` string,
        `Zip` string
    >,
    `ServiceCode` string,
    `Description` string,
    `TaxRate` numeric,
    `SubTotal` numeric,
    `Tax` numeric,
    `TaxDetails` array<struct<
        `CountryOfTax` string,
        `TaxLabel` string,
        `TaxRate` numeric,
        `TaxAmount` numeric
    >>,
    `Total` numeric,
    `Balance` numeric,
    `Cost` numeric,
    `InvoiceDate` timestamp,
    `WorkDate` timestamp,
    `DueDate` timestamp,
    `TimeRange` string,
    `Duration` numeric,
    `InvoiceType` string,
    `OrderType` string,
    `SetupType` string,
    `OrderDate` timestamp,
    `Origin` string,
    `Route` string,
    `Measurement` numeric,
    `MeasurementType` string,
    `TaxCode` string,
    `PurchaseOrderNumber` string,
    `Division` string,
    `Source` string,
    `GLCode` string,
    `ParentInvoiceID` int64,
    `LocationInstructions` string,
    `ServiceInstructions` string,
    `OrderInstructions` string,
    `TechnicianComment` string,
    `Printed` bool,
    `PrintedDate` timestamp,
    `Terms` string,
    `CreditMemoReason` string,
    `TaxOnlyCreditMemo` bool,
    `BatchNumber` int64,
    `Void` bool,
    `NotServicedReason` string,
    `ConsolidatedInvoiceNum` string,
    `ConsolidatedInvoiceDate` timestamp,
    `LineItems` array<struct<
        `ServiceCode` string,
        `Description` string,
        `Cost` numeric,
        `UnitPrice` numeric,
        `Quantity` numeric,
        `ExtendedPrice` numeric,
        `Taxable` bool,
        `GLCode` string
    >>,
    `MaterialApplications` array<struct<
        `MaterialApplicationID` int64,
        `OrderID` int64,
        `OrderNum` int64,
        `InvoiceID` int64,
        `InvoiceNum` int64,
        `LocationID` int64,
        `MaterialID` int64,
        `MaterialCode` string,
        `MaterialName` string,
        `LotNumber` string,
        `EPARegistration` string,
        `Quantity` numeric,
        `UnitOfMeasure` string,
        `UndilutedQuantity` numeric,
        `UndilutedUnitOfMeasure` string,
        `ActiveIngredient` string,
        `ActiveIngredientPercentage` numeric,
        `ActiveIngredientConcentration` numeric,
        `ApplicationRate` string,
        `ApplicationMethod` string,
        `ApplicationEquipment` string,
        `SkyCondition` string,
        `AirTemperature` numeric,
        `WindVelocity` numeric,
        `WindDirection` string,
        `LinearFeet` numeric,
        `SquareFeet` numeric,
        `CubicFeet` numeric,
        `Comment` string,
        `Technician` string,
        `TechnicianName` string,
        `Device` string,
        `WorkDate` timestamp,
        `DateApplied` timestamp,
        `AreasApplied` array<string>,
        `TargetPests` array<string>,
        `TargetPestDescriptions` array<string>
    >>,
    `TargetPests` array<string>,
    `Technicians` array<struct<
        `Position` int64,
        `TechID` int64,
        `Code` string,
        `FirstName` string,
        `LastName` string,
        `Commission` numeric,
        `Bonus` numeric,
        `Share` numeric,
        `NoCommission` bool,
        `SignatureFilename` string,
        `Username` string
    >>,
    `UserDefinedFields` array<struct<
        `FieldNum` int64,
        `Caption` string,
        `Value` string,
        `Description` string,
        `Type` string,
        `Show` bool,
        `TableName` string
    >>,
    `PdfUrls` struct<
        `AdditionalProp1` string,
        `AdditionalProp2` string,
        `AdditionalProp3` string,
        `Invoice` string,
        `InspectionReport` string
    >,
    `Applications` array<struct<
        `ApplyFromType` string,
        `ApplyFromID` int64,
        `Amount` numeric,
        `Committed` bool,
        `Payment` struct<
            `PaymentID` int64,
            `BillToID` int64,
            `BatchNumber` int64,
            `BranchID` int64,
            `Branch` string,
            `PaymentDate` timestamp,
            `Amount` numeric,
            `Balance` numeric,
            `Reference` string,
            `MethodOfPayment` string,
            `GLCode` string,
            `Service` string,
            `ServiceDescription` string,
            `Committed` bool,
            `PaymentType` string,
            `AdjustmentReason` string,
            `RelatedPaymentID` int64
        >,
        `Adjustment` struct<
            `PaymentID` int64,
            `BillToID` int64,
            `BatchNumber` int64,
            `BranchID` int64,
            `Branch` string,
            `PaymentDate` timestamp,
            `Amount` numeric,
            `Balance` numeric,
            `Reference` string,
            `MethodOfPayment` string,
            `GLCode` string,
            `Service` string,
            `ServiceDescription` string,
            `Committed` bool,
            `PaymentType` string,
            `AdjustmentReason` string,
            `RelatedPaymentID` int64
        >,
        `CreditMemo` struct<
            `InvoiceID` int64,
            `LocationID` int64,
            `BillToID` int64,
            `SetupID` int64,
            `InvoiceNumber` string,
            `Branch` string,
            `BranchID` int64,
            `ParentInvoiceID` int64,
            `ServiceCode` string,
            `Description` string,
            `SubTotal` numeric,
            `Tax` numeric,
            `TaxDetails` array<struct<
                `CountryOfTax` string,
                `TaxLabel` string,
                `TaxRate` numeric,
                `TaxAmount` numeric
            >>,
            `Total` numeric,
            `Balance` numeric,
            `InvoiceDate` timestamp,
            `WorkDate` timestamp,
            `DueDate` timestamp,
            `Duration` numeric,
            `TimeRange` string,
            `InvoiceType` string,
            `Origin` string,
            `Tech1` string,
            `TechID1` int64,
            `Route` string,
            `ConsolidatedInvoiceNum` string,
            `ConsolidatedInvoiceDate` timestamp,
            `PdfUrls` struct<
                `AdditionalProp1` string,
                `AdditionalProp2` string,
                `AdditionalProp3` string,
                `Invoice` string,
                `InspectionReport` string
            >,
            `AutoBill` bool,
            `BundleName` string,
            `DiscountCode` string,
            `LocationBundleID` int64,
            `OrderID` int64,
            `OrderNumber` string,
            `UncommittedBalance` numeric,
            `ExternalIdentifier` string
        >,
        `PendingCreditMemo` struct<
            `OrderID` int64,
            `LocationID` int64,
            `BillToID` int64,
            `SetupID` int64,
            `LeadID` string,
            `OrderNumber` string,
            `Branch` string,
            `BranchID` int64,
            `ParentOrderID` int64,
            `LocationInstructions` string,
            `ServiceInstructions` string,
            `OrderInstructions` string,
            `TechnicianComment` string,
            `InProgress` bool,
            `Posted` bool,
            `ServiceCode` string,
            `Description` string,
            `SubTotal` numeric,
            `Tax` numeric,
            `TaxDetails` array<struct<
                `CountryOfTax` string,
                `TaxLabel` string,
                `TaxRate` numeric,
                `TaxAmount` numeric
            >>,
            `Total` numeric,
            `WorkDate` timestamp,
            `TimeRange` string,
            `Locked` bool,
            `Duration` numeric,
            `OrderType` string,
            `Origin` string,
            `Tech1` string,
            `TechID1` int64,
            `Route` string,
            `PdfUrls` struct<
                `AdditionalProp1` string,
                `AdditionalProp2` string,
                `AdditionalProp3` string,
                `Invoice` string,
                `InspectionReport` string
            >,
            `UserDefinedFields` array<struct<
                `FieldNum` int64,
                `Caption` string,
                `Value` string,
                `Description` string,
                `Type` string,
                `Show` bool,
                `TableName` string
            >>,
            `BundleName` string,
            `DiscountCode` string,
            `LocationBundleID` int64,
            `BatchNumber` int64,
            `ExternalIdentifier` string
        >,
        `ReversePayment` struct<
            `PaymentID` int64,
            `BillToID` int64,
            `BatchNumber` int64,
            `BranchID` int64,
            `Branch` string,
            `PaymentDate` timestamp,
            `Amount` numeric,
            `Balance` numeric,
            `Reference` string,
            `MethodOfPayment` string,
            `GlCode` string,
            `Service` string,
            `ServiceDescription` string,
            `Committed` bool,
            `PaymentType` string,
            `AdjustmentReason` string,
            `RelatedPaymentID` int64
        >
    >>,
    `AppliedTo` array<struct<
        `ApplyToType` string,
        `ApplyToID` int64,
        `Amount` numeric,
        `Committed` bool,
        `AdjustmentReason` string,
        `AdjustmentAmount` numeric,
        `ServiceID` int64,
        `Invoice` struct<
            `InvoiceID` int64,
            `LocationID` int64,
            `BillToID` int64,
            `SetupID` int64,
            `InvoiceNumber` string,
            `Branch` string,
            `BranchID` int64,
            `ParentInvoiceID` int64,
            `ServiceCode` string,
            `Description` string,
            `SubTotal` numeric,
            `Tax` numeric,
            `TaxDetails` array<struct<
                `CountryOfTax` string,
                `TaxLabel` string,
                `TaxRate` numeric,
                `TaxAmount` numeric
            >>,
            `Total` numeric,
            `Balance` numeric,
            `InvoiceDate` timestamp,
            `WorkDate` timestamp,
            `DueDate` timestamp,
            `Duration` numeric,
            `TimeRange` string,
            `InvoiceType` string,
            `Origin` string,
            `Tech1` string,
            `TechID1` int64,
            `Route` string,
            `ConsolidatedInvoiceNum` string,
            `ConsolidatedInvoiceDate` timestamp,
            `PdfUrls` struct<
                `AdditionalProp1` string,
                `AdditionalProp2` string,
                `AdditionalProp3` string,
                `Invoice` string,
                `InspectionReport` string
            >,
            `AutoBill` bool,
            `BundleName` string,
            `DiscountCode` string,
            `LocationBundleID` int64,
            `OrderID` int64,
            `OrderNumber` string,
            `UncommittedBalance` numeric,
            `ExternalIdentifier` string
        >,
        `ServiceOrder` struct<
            `OrderID` int64,
            `LocationID` int64,
            `BillToID` int64,
            `SetupID` int64,
            `LeadID` int64,
            `OrderNumber` string,
            `Branch` string,
            `BranchID` int64,
            `ParentOrderID` int64,
            `LocationInstructions` string,
            `ServiceInstructions` string,
            `OrderInstructions` string,
            `TechnicianComment` string,
            `InProgress` bool,
            `Posted` bool,
            `ServiceCode` string,
            `Description` string,
            `SubTotal` numeric,
            `Tax` numeric,
            `TaxDetails` array <struct<
                `CountryOfTax` string,
                `TaxLabel` string,
                `TaxRate` numeric,
                `TaxAmount` numeric
            >>,
            `Total` numeric,
            `WorkDate` timestamp,
            `TimeRange` string,
            `Locked` bool,
            `Duration` numeric,
            `OrderType` string,
            `Origin` string,
            `Tech1` string,
            `TechID1` int64,
            `Route` string,
            `PdfUrls` struct<
                `AdditionalProp1` string,
                `AdditionalProp2` string,
                `AdditionalProp3` string,
                `Invoice` string,
                `InspectionReport` string
            >,
            `UserDefinedFields` array<struct<
                `FieldNum` int64,
                `Caption` string,
                `Value` string,
                `Description` string,
                `Type` string,
                `Show` bool,
                `TableName` string
            >>,
            `BundleName` string,
            `DiscountCode` string,
            `LocationBundleID` int64,
            `BatchNumber` int64,
            `ExternalIdentifier` string >,
        `ServiceSetup` struct<
            `SetupID` int64,
            `ProgramID` int64,
            `LocationID` int64,
            `ServiceCode` string,
            `DiscountPercentage` numeric,
            `AnnualAdvanceRenewal` bool,
            `IncludeInitial` bool
        >,
        `Renewal` struct<
            SetupID int64,
            `LocationID` int64,
            `StartDate` timestamp,
            `RenewalDate` timestamp,
            `RenewalPrice` numeric,
            `CreateInvoice` bool,
            `InvoiceDate` timestamp,
            `CreateServiceOrder` bool,
            `OrderType` string,
            `WorkDate` timestamp,
            `Duration` numeric,
            `TimeRange` string,
            `Color` string,
            `TechID1` int64,
            `TechBonus1` numeric,
            `TechShare1` numeric,
            `TechNoCommission1` bool,
            `TechID2` int64,
            `TechBonus2` numeric,
            `TechShare2` numeric,
            `TechNoCommission2` bool,
            `TechID3` int64,
            `TechBonus3` numeric,
            `TechShare3` numeric,
            `TechNoCommission3` bool,
            `TechID4` int64,
            `TechBonus4` numeric,
            `TechShare4` numeric,
            `TechNoCommission4` bool,
            `TechID5` int64,
            `TechBonus5` numeric,
            `TechShare5` numeric,
            `TechNoCommission5` bool,
            `AnnualAdvanceRenewal` bool,
            `RenewalInterval` numeric,
            `AdvanceRenewalOnly` bool,
            `RenewSetupIDs` string,
            `AdvanceSAD` bool,
            `AsfSetupIDs` string
        >
    >>,
    `BundleName` string,
    `DiscountCode` string,
    `OpportunityId` int64,
    `LocationBundleID` int64,
    `OrderID` int64,
    `ExternalIdentifier` string,
    `ServiceOrderAttributes` array<struct<
        `AttributeAssignmentID` int64,
        `OrderID` int64,
        `InvoiceID` int64,
        `AttributeID` int64,
        `Category` string,
        `Description` string,
        `Type` string,
        `Answer` string,
        `YesText` string,
        `NoText` string,
        `CheckboxText` string
    >>,
    `tenant_id` int64 not null,
    primary key(`InvoiceID`, `tenant_id`) not enforced
)
cluster by tenant_id
